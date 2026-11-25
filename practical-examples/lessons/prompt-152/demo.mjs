import { pgLab } from "../../shared/postgres.mjs";
import { buildTaskApi, registerAndLogin } from "../../shared/task-api.mjs";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
await using db = await pgLab();
let fail = false;
const app = await buildTaskApi({
  pool: db.pool,
  key: randomBytes(32),
  afterFirstInsert: async () => {
    if (fail) throw Error("injected transaction failure");
  },
});
try {
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/register",
        headers: { "content-type": "application/json" },
        payload: "{",
      })
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/register",
        payload: { email: "x@course.invalid", password: "x".repeat(5000) },
      })
    ).statusCode,
    413,
  );
  const a = await registerAndLogin(app, "a@course.invalid"),
    b = await registerAndLogin(app, "b@course.invalid");
  const made = await app.inject({
    method: "POST",
    url: "/tasks",
    headers: a.headers,
    payload: { title: "capstone" },
  });
  assert.equal(made.statusCode, 201);
  const task = made.json();
  assert.equal(
    (await app.inject({ url: "/tasks/" + task.id, headers: b.headers }))
      .statusCode,
    404,
  );
  const updates = await Promise.all(
    ["A", "B"].map((title) =>
      app.inject({
        method: "PATCH",
        url: "/tasks/" + task.id,
        headers: a.headers,
        payload: { title, version: 0 },
      }),
    ),
  );
  assert.deepEqual(updates.map((x) => x.statusCode).sort(), [200, 409]);
  const before = (await db.pool.query("SELECT count(*) FROM tasks")).rows[0]
    .count;
  fail = true;
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/tasks/batch",
        headers: a.headers,
        payload: { titles: ["one", "two"] },
      })
    ).statusCode,
    500,
  );
  assert.equal(
    (await db.pool.query("SELECT count(*) FROM tasks")).rows[0].count,
    before,
  );
  console.log(
    "authentication, owner isolation, concurrency and injected rollback verified",
  );
} finally {
  await app.close();
}
