import Fastify from "fastify";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify(),
  tasks = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: "Task " + (i + 1),
  }));
app.get("/tasks", async (q, r) => {
  const after = Number(q.query.after ?? 0),
    limit = Number(q.query.limit ?? 2);
  if (
    !Number.isSafeInteger(after) ||
    after < 0 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  )
    return r.code(400).send({ error: "Invalid cursor or limit" });
  const items = tasks.filter((x) => x.id > after).slice(0, limit);
  return { items, next: items.length ? items.at(-1).id : null };
});
await inspectApp(app, async () => {
  let after = 0,
    ids = [];
  while (true) {
    const r = (await app.inject("/tasks?after=" + after)).json();
    console.log(r);
    if (!r.items.length) break;
    ids.push(...r.items.map((x) => x.id));
    after = r.next;
  }
  assert.deepEqual(ids, [1, 2, 3, 4, 5]);
  assert.equal((await app.inject("/tasks?limit=1000")).statusCode, 400);
});
