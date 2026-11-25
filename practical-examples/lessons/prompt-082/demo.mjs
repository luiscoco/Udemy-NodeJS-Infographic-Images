import { WebSocketServer } from "ws";
import assert from "node:assert/strict";
const server = new WebSocketServer({
  port: 0,
  host: "127.0.0.1",
  maxPayload: 1024,
});
const timer = setInterval(() => {
  for (const client of server.clients) {
    if (client.isAlive === false) {
      client.terminate();
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, 1000);
server.on("connection", (socket) => {
  socket.isAlive = true;
  socket.on("pong", () => (socket.isAlive = true));
  socket.on("error", () => {});
  socket.on("message", (data) => {
    try {
      const value = JSON.parse(data);
      if (typeof value.text !== "string")
        return socket.close(1008, "Invalid message");
      if (socket.bufferedAmount > 65536)
        return socket.close(1013, "Slow client");
      socket.send(JSON.stringify(value));
    } catch {
      socket.close(1008, "Invalid JSON");
    }
  });
});
await new Promise((r) => server.once("listening", r));
const client = new WebSocket("ws://127.0.0.1:" + server.address().port);
try {
  await new Promise((resolve, reject) => {
    client.addEventListener("open", resolve, { once: true });
    client.addEventListener("error", reject, { once: true });
  });
  const received = new Promise((r) =>
    client.addEventListener("message", (e) => r(e.data), { once: true }),
  );
  client.send(JSON.stringify({ text: "hello" }));
  const data = await received;
  console.log(data);
  assert.equal(JSON.parse(data).text, "hello");
} finally {
  client.close();
  await new Promise((r) => client.addEventListener("close", r, { once: true }));
  clearInterval(timer);
  await new Promise((r) => server.close(r));
}
