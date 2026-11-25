import Fastify from "fastify";
import swagger from "@fastify/swagger";
import assert from "node:assert/strict";
const app = Fastify();
try {
  await app.register(swagger, {
    openapi: { info: { title: "Tasks API", version: "1.0.0" } },
  });
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: { type: "object", properties: { ok: { type: "boolean" } } },
        },
      },
    },
    async () => ({ ok: true }),
  );
  await app.ready();
  const doc = app.swagger();
  console.log(JSON.stringify(doc, null, 2));
  assert.equal(doc.info.title, "Tasks API");
  assert.ok(doc.paths["/health"]);
  assert.equal((await app.inject("/health")).json().ok, true);
} finally {
  await app.close();
}
