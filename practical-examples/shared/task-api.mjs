import Fastify from "fastify";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "node:crypto";
import { transaction } from "./postgres.mjs";
import { hashPassword, verifyPassword } from "./passwords.mjs";
const issuer = "https://course.example",
  audience = "tasks-api";
export async function buildTaskApi({
  pool,
  key,
  afterFirstInsert = async () => {},
  logger = false,
}) {
  if (!(key instanceof Uint8Array) || key.length < 32)
    throw Error("Supply a 32-byte signing key");
  const app = Fastify({
    bodyLimit: 4096,
    logger: logger
      ? {
          redact: {
            paths: ["req.headers.authorization", "password"],
            remove: true,
          },
        }
      : false,
  });
  const state = { started: false, stopping: false };
  app.decorate("courseState", state);
  app.addHook("onReady", async () => {
    await pool.query("SELECT 1");
    state.started = true;
  });
  app.addHook("preClose", async () => {
    state.stopping = true;
  });
  app.get("/live", async () => ({ alive: true }));
  app.get("/ready", async (q, r) => {
    if (!state.started || state.stopping)
      return r.code(503).send({ ready: false });
    try {
      await pool.query("SELECT 1");
      return { ready: true };
    } catch {
      return r.code(503).send({ ready: false });
    }
  });
  const credentials = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", minLength: 3, maxLength: 200 },
      password: { type: "string", minLength: 8, maxLength: 256 },
    },
    additionalProperties: false,
  };
  app.post("/register", { schema: { body: credentials } }, async (q, r) => {
    const id = randomUUID(),
      password = await hashPassword(q.body.password);
    try {
      await pool.query(
        "INSERT INTO users(id,email,password) VALUES($1,$2,$3)",
        [id, q.body.email, password],
      );
      return r.code(201).send({ id });
    } catch (e) {
      if (e.code === "23505")
        return r.code(409).send({ error: "Already registered" });
      throw e;
    }
  });
  app.post("/login", { schema: { body: credentials } }, async (q, r) => {
    const row = (
      await pool.query("SELECT * FROM users WHERE email=$1", [q.body.email])
    ).rows[0];
    if (!row || !(await verifyPassword(q.body.password, row.password)))
      return r.code(401).send({ error: "Invalid credentials" });
    const token = await new SignJWT({ sub: row.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(key);
    return { token };
  });
  async function auth(q, r) {
    try {
      const raw = q.headers.authorization;
      if (!raw?.startsWith("Bearer ")) throw Error("Missing bearer");
      q.user = (
        await jwtVerify(raw.slice(7), key, {
          algorithms: ["HS256"],
          issuer,
          audience,
        })
      ).payload;
    } catch {
      return r.code(401).send({ error: "Unauthorized" });
    }
  }
  app.decorate("authenticate", auth);
  const titleBody = {
    type: "object",
    required: ["title"],
    properties: { title: { type: "string", minLength: 1, maxLength: 200 } },
    additionalProperties: false,
  };
  app.get(
    "/tasks",
    { preHandler: auth },
    async (q) =>
      (
        await pool.query(
          "SELECT id,title,version FROM tasks WHERE owner_id=$1 ORDER BY id",
          [q.user.sub],
        )
      ).rows,
  );
  app.post(
    "/tasks",
    { preHandler: auth, schema: { body: titleBody } },
    async (q, r) =>
      r
        .code(201)
        .send(
          (
            await pool.query(
              "INSERT INTO tasks(title,owner_id) VALUES($1,$2) RETURNING id,title,version",
              [q.body.title, q.user.sub],
            )
          ).rows[0],
        ),
  );
  app.get("/tasks/:id", { preHandler: auth }, async (q, r) => {
    if (!/^\d+$/.test(q.params.id))
      return r.code(400).send({ error: "Invalid id" });
    const row = (
      await pool.query(
        "SELECT id,title,version FROM tasks WHERE id=$1 AND owner_id=$2",
        [q.params.id, q.user.sub],
      )
    ).rows[0];
    return row ?? r.code(404).send({ error: "Not found" });
  });
  app.patch(
    "/tasks/:id",
    {
      preHandler: auth,
      schema: {
        body: {
          ...titleBody,
          required: ["title", "version"],
          properties: {
            ...titleBody.properties,
            version: { type: "integer", minimum: 0 },
          },
        },
      },
    },
    async (q, r) => {
      if (!/^\d+$/.test(q.params.id))
        return r.code(400).send({ error: "Invalid id" });
      const changed = await pool.query(
        "UPDATE tasks SET title=$1,version=version+1 WHERE id=$2 AND owner_id=$3 AND version=$4 RETURNING id,title,version",
        [q.body.title, q.params.id, q.user.sub, q.body.version],
      );
      if (changed.rowCount) return changed.rows[0];
      const own = await pool.query(
        "SELECT id FROM tasks WHERE id=$1 AND owner_id=$2",
        [q.params.id, q.user.sub],
      );
      return r
        .code(own.rowCount ? 409 : 404)
        .send({ error: own.rowCount ? "Version conflict" : "Not found" });
    },
  );
  app.delete("/tasks/:id", { preHandler: auth }, async (q, r) => {
    if (!/^\d+$/.test(q.params.id))
      return r.code(400).send({ error: "Invalid id" });
    const changed = await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND owner_id=$2",
      [q.params.id, q.user.sub],
    );
    return changed.rowCount
      ? r.code(204).send()
      : r.code(404).send({ error: "Not found" });
  });
  app.post(
    "/tasks/batch",
    {
      preHandler: auth,
      schema: {
        body: {
          type: "object",
          required: ["titles"],
          properties: {
            titles: {
              type: "array",
              minItems: 2,
              maxItems: 2,
              items: { type: "string", minLength: 1, maxLength: 200 },
            },
          },
        },
      },
    },
    async (q, r) => {
      const rows = await transaction(pool, async (client) => {
        const out = [];
        for (const [index, title] of q.body.titles.entries()) {
          out.push(
            (
              await client.query(
                "INSERT INTO tasks(title,owner_id) VALUES($1,$2) RETURNING id,title",
                [title, q.user.sub],
              )
            ).rows[0],
          );
          if (index === 0) await afterFirstInsert();
        }
        return out;
      });
      return r.code(201).send(rows);
    },
  );
  app.setErrorHandler((error, q, r) => {
    if (error.validation) return r.code(400).send({ error: "Invalid input" });
    if (
      Number.isInteger(error.statusCode) &&
      error.statusCode >= 400 &&
      error.statusCode < 500
    )
      return r
        .code(error.statusCode)
        .send({
          error:
            error.statusCode === 413 ? "Payload too large" : "Invalid request",
        });
    q.log.error({ err: error }, "request failed");
    return r.code(500).send({ error: "Internal error" });
  });
  return app;
}
export async function registerAndLogin(app, email = "a@course.invalid") {
  const password = "public-fixture-password";
  const registered = await app.inject({
    method: "POST",
    url: "/register",
    payload: { email, password },
  });
  if (registered.statusCode !== 201) throw Error("Registration failed");
  const response = await app.inject({
    method: "POST",
    url: "/login",
    payload: { email, password },
  });
  if (response.statusCode !== 200) throw Error("Login failed");
  return {
    user: registered.json(),
    headers: { authorization: "Bearer " + response.json().token },
  };
}
