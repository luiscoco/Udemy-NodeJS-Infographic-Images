import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import assert from "node:assert/strict";
const app = Fastify({ bodyLimit: 1024, trustProxy: false });
await app.register(rateLimit, { max: 20, timeWindow: "1 minute" });
app.get("/work", async () => ({ ok: true }));
app.post("/payload", async () => ({ ok: true }));
try {
  for (let i = 0; i < 20; i++)
    assert.equal((await app.inject("/work")).statusCode, 200);
  assert.equal((await app.inject("/work")).statusCode, 429);
  const oversized = await app.inject({
    method: "POST",
    url: "/payload",
    remoteAddress: "127.0.0.2",
    payload: { text: "x".repeat(2048) },
  });
  assert.equal(oversized.statusCode, 413);
  console.log("rate budget=429; independent oversized request=413");
} finally {
  await app.close();
}
