import WebSocket from "ws";
import { SignJWT } from "jose";
import { randomBytes, randomUUID } from "node:crypto";
import { pgLab } from "../../shared/postgres.mjs";
import { localURL } from "../../shared/env.mjs";
import { roomServer } from "../../applications/rooms/server.mjs";
import { assert, delay } from "../../shared/lab.mjs";
await using db = await pgLab();
const key = randomBytes(32),
  token = await new SignJWT({ sub: "user-a", rooms: ["room-a"] })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("https://course.example")
    .setAudience("rooms")
    .setExpirationTime("5m")
    .sign(key),
  namespace = "rooms-" + randomUUID() + ":",
  redisURL = localURL(process.env.REDIS_URL, "redis://127.0.0.1:56379").href;
const servers = await Promise.all(
    [1, 2].map(() => roomServer({ pool: db.pool, redisURL, key, namespace })),
  ),
  clients = [];
function wait(socket, predicate) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off("message", listener);
      reject(Error("Message deadline"));
    }, 5000);
    function listener(raw) {
      const value = JSON.parse(raw);
      if (predicate(value)) {
        clearTimeout(timer);
        socket.off("message", listener);
        resolve(value);
      }
    }
    socket.on("message", listener);
  });
}
async function connect(server, after = "0") {
  const socket = new WebSocket(server.url + "/room-a", {
    headers: { authorization: "Bearer " + token },
  });
  socket.on("error", () => {});
  clients.push(socket);
  await wait(socket, (m) => m.type === "ready");
  socket.send(JSON.stringify({ type: "resume", after }));
  return socket;
}
try {
  const a = await connect(servers[0]),
    b = await connect(servers[0]),
    c = await connect(servers[1]);
  const first = [a, b, c].map((socket) =>
    wait(socket, (m) => m.type === "event"),
  );
  a.send(JSON.stringify({ type: "message", text: "first" }));
  const received = await Promise.all(first);
  assert.equal(new Set(received.map((x) => x.id)).size, 1);
  const last = received[0].id;
  c.close();
  await new Promise((r) => c.once("close", r));
  const second = [a, b].map((socket) =>
    wait(socket, (m) => m.type === "event" && BigInt(m.id) > BigInt(last)),
  );
  b.send(JSON.stringify({ type: "message", text: "missed while offline" }));
  const live = await Promise.all(second);
  const reconnect = new WebSocket(servers[1].url + "/room-a", {
    headers: { authorization: "Bearer " + token },
  });
  reconnect.on("error", () => {});
  clients.push(reconnect);
  await wait(reconnect, (m) => m.type === "ready");
  const replay = wait(reconnect, (m) => m.type === "event");
  reconnect.send(JSON.stringify({ type: "resume", after: last }));
  assert.equal((await replay).id, live[0].id);
  const bad = new WebSocket(servers[0].url + "/room-a");
  bad.on("error", () => {});
  const denied = await new Promise((resolve) =>
    bad.on("unexpected-response", (q, r) => {
      r.resume();
      bad.terminate();
      resolve(r.statusCode);
    }),
  );
  assert.equal(denied, 401);
  console.log(
    "3 clients / 2 instances, durable first-store fan-out, offline replay and unauthorized upgrade rejection verified",
  );
} finally {
  for (const socket of clients) socket.terminate();
  await Promise.all(servers.map((x) => x.close()));
}
