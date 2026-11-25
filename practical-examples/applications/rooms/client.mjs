import WebSocket from "ws";
import { SignJWT } from "jose";
import { createInterface } from "node:readline";
import "../../shared/env.mjs";
if (!/^[a-f0-9]{64}$/i.test(process.env.JWT_KEY ?? ""))
  throw Error("Local development ticket requires the lab .env");
const token = await new SignJWT({ sub: "local-student", rooms: ["room-a"] })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuer("https://course.example")
  .setAudience("rooms")
  .setExpirationTime("5m")
  .sign(Buffer.from(process.env.JWT_KEY, "hex"));
const socket = new WebSocket(
    (process.env.ROOM_URL ?? "ws://127.0.0.1:8080") + "/room-a",
    { headers: { authorization: "Bearer " + token } },
  ),
  rl = createInterface({ input: process.stdin, output: process.stdout });
socket.on("message", (raw) => {
  const event = JSON.parse(raw);
  if (event.type === "ready")
    socket.send(
      JSON.stringify({ type: "resume", after: process.argv[2] ?? "0" }),
    );
  else console.log(event);
});
socket.on("error", (e) => console.error(e.message));
socket.on("close", () => rl.close());
rl.on("line", (text) => {
  if (socket.readyState === 1)
    socket.send(JSON.stringify({ type: "message", text }));
});
rl.on("close", () => socket.close());
console.log(
  "Type messages. The ticket is generated only for this local development lab and is never printed.",
);
