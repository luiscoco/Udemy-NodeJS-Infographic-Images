import Fastify from "fastify";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify();
app.post(
  "/tasks/:id",
  {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "integer" } },
      },
      body: {
        type: "object",
        required: ["title"],
        properties: { title: { type: "string", minLength: 1 } },
      },
      response: {
        201: {
          type: "object",
          additionalProperties: false,
          properties: { id: { type: "integer" }, title: { type: "string" } },
        },
      },
    },
  },
  async (q, r) =>
    r
      .code(201)
      .send({ id: q.params.id, title: q.body.title, internal: "hidden" }),
);
await inspectApp(app, async () => {
  for (const [url, payload, status] of [
    ["/tasks/1", { title: "hello" }, 201],
    ["/tasks/x", { title: "hello" }, 400],
    ["/tasks/1", {}, 400],
  ]) {
    const r = await app.inject({ method: "POST", url, payload });
    console.log(r.statusCode, r.body);
    assert.equal(r.statusCode, status);
    if (status === 201) assert.ok(!("internal" in r.json()));
  }
});
