import { pgLab } from "../../shared/postgres.mjs";
import { buildTaskApi, registerAndLogin } from "../../shared/task-api.mjs";
import { randomBytes } from "node:crypto";
import { SignJWT } from "jose";
import assert from "node:assert/strict";
await using db = await pgLab();
const key = randomBytes(32),
  app = await buildTaskApi({ pool: db.pool, key });
app.get("/role-tasks/:id", { preHandler: app.authenticate }, async (q, r) => {
  const id = Number(q.params.id);
  if (!Number.isSafeInteger(id) || id < 1)
    return r.code(400).send({ error: "Invalid id" });
  const row = (
    await db.pool.query(
      "SELECT id,title FROM tasks WHERE id=$1 AND (owner_id=$2 OR $3::boolean)",
      [id, q.user.sub, q.user.role === "admin"],
    )
  ).rows[0];
  return row ?? r.code(404).send({ error: "Not found" });
});
try {
  const a = await registerAndLogin(app, "a@course.invalid"),
    b = await registerAndLogin(app, "b@course.invalid");
  const created = await app.inject({
      method: "POST",
      url: "/tasks",
      headers: a.headers,
      payload: { title: "private" },
    }),
    id = created.json().id;
  for (const method of ["GET", "DELETE"])
    assert.equal(
      (await app.inject({ method, url: "/tasks/" + id, headers: b.headers }))
        .statusCode,
      404,
    );
  assert.equal(
    (await app.inject({ url: "/tasks/" + id, headers: a.headers })).statusCode,
    200,
  );
  assert.equal((await app.inject("/tasks")).statusCode, 401);
  assert.equal(
    (
      await app.inject({
        url: "/role-tasks/" + id,
        headers: { ...b.headers, role: "admin" },
      })
    ).statusCode,
    404,
  );
  const adminToken = await new SignJWT({
    sub: "trusted-admin-fixture",
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("https://course.example")
    .setAudience("tasks-api")
    .setExpirationTime("5m")
    .sign(key);
  assert.equal(
    (
      await app.inject({
        url: "/role-tasks/" + id,
        headers: { authorization: "Bearer " + adminToken },
      })
    ).statusCode,
    200,
  );
  console.log(
    "owner=200, another user=404, unauthenticated=401; forged role header rejected; signed admin claim accepted by role-aware route",
  );
} finally {
  await app.close();
}
