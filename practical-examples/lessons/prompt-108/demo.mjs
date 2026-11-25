import { pgLab } from "../../shared/postgres.mjs";
import { buildTaskApi, registerAndLogin } from "../../shared/task-api.mjs";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
await using db = await pgLab();
const app = await buildTaskApi({ pool: db.pool, key: randomBytes(32) });
try {
  const user = await registerAndLogin(app);
  const response = await app.inject({
    method: "POST",
    url: "/tasks",
    headers: user.headers,
    payload: { title: "integration fixture" },
  });
  assert.equal(response.statusCode, 201);
  const created = response.json();
  const row = (
    await db.pool.query("SELECT title FROM tasks WHERE id=$1", [created.id])
  ).rows[0];
  assert.equal(row.title, "integration fixture");
  console.log("HTTP contract and real PostgreSQL persistence verified");
} finally {
  await app.close();
}
