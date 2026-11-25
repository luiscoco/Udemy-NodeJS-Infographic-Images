import { pgLab } from "../../shared/postgres.mjs";
import { buildTaskApi } from "../../shared/task-api.mjs";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
await using db = await pgLab();
let unavailable = false;
const pool = {
  query(...args) {
    if (unavailable) throw Error("injected DB outage");
    return db.pool.query(...args);
  },
};
const app = await buildTaskApi({ pool, key: randomBytes(32) });
try {
  await app.ready();
  app.courseState.started = false;
  assert.equal((await app.inject("/ready")).statusCode, 503);
  app.courseState.started = true;
  assert.equal((await app.inject("/ready")).statusCode, 200);
  unavailable = true;
  assert.equal((await app.inject("/ready")).statusCode, 503);
  assert.equal((await app.inject("/live")).statusCode, 200);
  unavailable = false;
  app.courseState.stopping = true;
  assert.equal((await app.inject("/ready")).statusCode, 503);
  console.log(
    "startup=503, healthy=200, injected dependency outage=503 with live=200, stopping=503",
  );
} finally {
  await app.close();
}
