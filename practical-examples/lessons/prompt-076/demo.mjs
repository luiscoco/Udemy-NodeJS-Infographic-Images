import Fastify from "fastify";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify();
const phases = [];
app.addHook("onRequest", async () => {
  phases.push("onRequest");
});
app.setErrorHandler((error, q, r) =>
  r.code(500).send({ error: "Internal error" }),
);
app.get("/tasks", async () => [{ id: 1, title: "Learn Node.js" }]);
app.get("/fail", async () => {
  throw Error("private fixture detail");
});
await inspectApp(app, async () => {
  for (const [url, status] of [
    ["/tasks", 200],
    ["/missing", 404],
    ["/fail", 500],
  ]) {
    const r = await app.inject(url);
    console.log(url, r.statusCode, r.body);
    assert.equal(r.statusCode, status);
  }
  assert.equal(phases.length, 3);
});
