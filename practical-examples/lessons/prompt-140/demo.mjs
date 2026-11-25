import { pgLab } from "../../shared/postgres.mjs";
import { Pool } from "pg";
import { buildTaskApi, registerAndLogin } from "../../shared/task-api.mjs";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
await using db = await pgLab();
const pools = [1, 2].map(() => new Pool({ ...db.pool.options, max: 10 })),
  key = randomBytes(32),
  apps = await Promise.all(pools.map((pool) => buildTaskApi({ pool, key })));
try {
  const user = await registerAndLogin(apps[0]);
  const made = await apps[0].inject({
    method: "POST",
    url: "/tasks",
    headers: user.headers,
    payload: { title: "shared persistent task" },
  });
  const response = await apps[1].inject({
    url: "/tasks/" + made.json().id,
    headers: user.headers,
  });
  assert.equal(response.statusCode, 200);
  console.log({
    replicas: 2,
    apiConnectionCap: pools.reduce((n, p) => n + p.options.max, 0),
    exampleWithOverhead: 30,
    exampleBudget: 50,
    sharedTask: response.json().title,
  });
} finally {
  await Promise.all(apps.map((x) => x.close()));
  await Promise.all(pools.map((x) => x.end()));
}
