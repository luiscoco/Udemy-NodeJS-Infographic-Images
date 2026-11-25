import Fastify from "fastify";
import cors from "@fastify/cors";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify();
await app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});
app.get("/data", async () => ({ ok: true }));
await inspectApp(app, async () => {
  for (const origin of ["http://localhost:5173", "http://untrusted.invalid"]) {
    const r = await app.inject({ url: "/data", headers: { origin } });
    console.log({
      origin,
      status: r.statusCode,
      allow: r.headers["access-control-allow-origin"],
    });
    assert.equal(r.statusCode, 200);
    assert.equal(
      r.headers["access-control-allow-origin"],
      "http://localhost:5173",
    );
  }
  console.log(
    "CORS headers grant the configured origin; they do not authenticate requests.",
  );
});
