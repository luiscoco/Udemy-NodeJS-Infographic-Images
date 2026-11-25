import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { createClient } from "redis";
import { jwtVerify } from "jose";
export async function roomServer({ pool, redisURL, key, namespace, port = 0 }) {
  const subscriber = createClient({ url: redisURL }),
    publisher = subscriber.duplicate();
  subscriber.on("error", () => {});
  publisher.on("error", () => {});
  await subscriber.connect();
  await publisher.connect();
  const rooms = new Map();
  const wss = new WebSocketServer({ noServer: true, maxPayload: 4096 });
  const http = createServer((q, r) => {
    r.writeHead(404);
    r.end();
  });
  function send(socket, event) {
    if (socket.bufferedAmount > 1000000) {
      socket.close(1013, "Client too slow");
      return false;
    }
    socket.send(JSON.stringify(event));
    return true;
  }
  function deliver(socket, event) {
    const state = socket.course;
    if (!state || socket.readyState !== 1) return;
    if (state.replaying) {
      if (state.pending.length >= 1000)
        return socket.close(1013, "Replay buffer full");
      state.pending.push(event);
      return;
    }
    if (BigInt(event.id) > state.last) {
      if (send(socket, event)) state.last = BigInt(event.id);
    }
  }
  async function join(room, socket) {
    let state = rooms.get(room);
    if (state?.closing) {
      await state.closing;
      state = rooms.get(room);
    }
    if (!state) {
      state = { sockets: new Set() };
      rooms.set(room, state);
      state.ready = subscriber.subscribe(namespace + room, (message) => {
        const event = JSON.parse(message);
        for (const member of state.sockets) deliver(member, event);
      });
    }
    await state.ready;
    if (socket.readyState !== 1) return;
    state.sockets.add(socket);
    socket.course = { room, last: 0n, replaying: true, pending: [] };
    socket.on("close", () => {
      state.sockets.delete(socket);
      if (!state.sockets.size) {
        state.closing = subscriber.unsubscribe(namespace + room).then(() => {
          if (rooms.get(room) === state) rooms.delete(room);
        });
      }
    });
    send(socket, { type: "ready" });
  }
  async function publish(room, payload) {
    const client = await pool.connect();
    try {
      await client.query("SELECT pg_advisory_lock(hashtext($1))", [
        namespace + room,
      ]);
      const row = (
        await client.query(
          "INSERT INTO room_events(room_id,payload) VALUES($1,$2) RETURNING id,payload",
          [room, payload],
        )
      ).rows[0];
      await publisher.publish(
        namespace + room,
        JSON.stringify({ type: "event", ...row }),
      );
    } finally {
      try {
        await client.query("SELECT pg_advisory_unlock(hashtext($1))", [
          namespace + room,
        ]);
      } finally {
        client.release();
      }
    }
  }
  http.on("upgrade", async (req, socket, head) => {
    try {
      const room = new URL(req.url, "http://localhost").pathname.slice(1),
        header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) throw Error("Unauthorized");
      const { payload } = await jwtVerify(header.slice(7), key, {
        algorithms: ["HS256"],
        issuer: "https://course.example",
        audience: "rooms",
      });
      if (!Array.isArray(payload.rooms) || !payload.rooms.includes(room))
        throw Error("Unauthorized room");
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, room),
      );
    } catch {
      socket.end("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
    }
  });
  wss.on("connection", (socket, room) => {
    socket.on("error", () => {});
    socket.alive = true;
    socket.on("pong", () => (socket.alive = true));
    const joined = join(room, socket);
    socket.on("message", (raw) => {
      void (async () => {
        await joined;
        const message = JSON.parse(raw);
        if (message.type === "resume") {
          const after = String(message.after ?? "0");
          if (!/^\d+$/.test(after)) return socket.close(1008, "Invalid cursor");
          const history = (
            await pool.query(
              "SELECT id,payload FROM room_events WHERE room_id=$1 AND id>$2 ORDER BY id LIMIT 101",
              [room, after],
            )
          ).rows;
          if (history.length > 100) {
            send(socket, {
              type: "resync-required",
              reason: "Replay window exceeds 100 events",
            });
            return socket.close(1008, "Snapshot resync required");
          }
          socket.course.last = BigInt(after);
          for (const event of history) {
            if (
              BigInt(event.id) > socket.course.last &&
              send(socket, { type: "event", ...event })
            )
              socket.course.last = BigInt(event.id);
          }
          const pending = socket.course.pending.sort((a, b) =>
            BigInt(a.id) < BigInt(b.id) ? -1 : 1,
          );
          socket.course.pending = [];
          socket.course.replaying = false;
          for (const event of pending) deliver(socket, event);
        } else if (
          message.type === "message" &&
          typeof message.text === "string" &&
          message.text.length <= 1000
        ) {
          await publish(room, { text: message.text });
        } else socket.close(1008, "Invalid message");
      })().catch(() => socket.close(1011, "Room operation failed"));
    });
    joined.catch(() => socket.close(1011, "Subscription failed"));
  });
  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (!socket.alive) {
        socket.terminate();
        continue;
      }
      socket.alive = false;
      socket.ping();
    }
  }, 1000);
  await new Promise((resolve, reject) => {
    http.once("error", reject);
    http.listen(port, "127.0.0.1", resolve);
  });
  return {
    url: "ws://127.0.0.1:" + http.address().port,
    rooms,
    async close() {
      clearInterval(heartbeat);
      for (const socket of wss.clients) socket.terminate();
      await new Promise((r) => wss.close(r));
      await Promise.all(
        [...rooms.values()].map((x) => x.closing ?? Promise.resolve()),
      );
      await subscriber.quit();
      await publisher.quit();
      await new Promise((r) => http.close(r));
    },
  };
}
