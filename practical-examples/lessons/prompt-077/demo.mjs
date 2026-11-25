import express from "express";
import { createServer } from "node:http";
import { assert, listen, close } from "../../shared/lab.mjs";
const app = express(),
  order = [];
app.use((q, r, next) => {
  order.push("before");
  next();
});
app.get("/tasks", (q, r) => r.json([]));
app.get("/fail", async () => {
  throw Error("fixture");
});
app.use((e, q, r, next) => {
  if (r.headersSent) return next(e);
  order.push("error");
  r.status(500).json({ error: "Internal error" });
});
const server = createServer(app),
  base = await listen(server);
try {
  for (const [path, status] of [
    ["/tasks", 200],
    ["/fail", 500],
    ["/missing", 404],
  ]) {
    const r = await fetch(base + path);
    console.log(path, r.status, await r.text());
    assert.equal(r.status, status);
  }
  console.log(order);
} finally {
  await close(server);
}
