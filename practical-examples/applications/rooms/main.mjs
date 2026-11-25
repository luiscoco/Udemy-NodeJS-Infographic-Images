import { Pool } from "pg";
import { roomServer } from "./server.mjs";
import { localURL } from "../../shared/env.mjs";
if (!/^[a-f0-9]{64}$/i.test(process.env.JWT_KEY ?? ""))
  throw Error("Run tools/setup.mjs");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  options: "-c search_path=course_app",
  connectionTimeoutMillis: 2000,
});
const server = await roomServer({
  pool,
  redisURL: localURL(process.env.REDIS_URL, "redis://127.0.0.1:56379").href,
  key: Buffer.from(process.env.JWT_KEY, "hex"),
  namespace: "course-live-room:",
  port: Number(process.env.ROOM_PORT ?? 8080),
});
console.log("Room server:", server.url);
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await server.close();
  await pool.end();
}
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
