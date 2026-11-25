# Prompt 152: Database-Backed API with Authentication

Category: EcosystemPurpose: Combine API contracts, persistence, identity, and authorization.
Learning goals: Fastify, PostgreSQL, pooling, migrations, transactions, password derivation, token verification, ownership rules, and integration tests.
Implementation prompt:
Build a task-management API using fastify, pg, node-pg-migrate, and jose, with PostgreSQL persistence and core crypto.scrypt password verification. Implement registration, authentication, owner-scoped task operations, validation, pagination, and one transactional business operation. Supply integration tests for authentication failures, cross-user access, rollback, and concurrent writes.
Acceptance criteria:
A fresh database can be created through migrations.
Data survives application restart.
Missing, invalid, and expired credentials are rejected.
User A cannot access user B’s tasks.
An injected transaction failure rolls back all related changes.
Concurrent requests preserve a stated database invariant.
Passwords, signing keys, and bearer credentials do not appear in responses or logs.
Suggested point: After Module 14.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 152
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A complete task API registers/logs in real users, enforces ownership, rejects stale edits and rolls back an injected batch failure.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

The task API combines validation, salted password verification, JWT authentication, owner-scoped queries, optimistic updates, and transactions. Each protects a different stage of the request.

### Follow the implementation

From [../../shared/task-api.mjs, lines 86-100](../../shared/task-api.mjs#L86) (source excerpt; run the full application using the command above):

```javascript
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
```

From [../../shared/task-api.mjs, lines 134-144](../../shared/task-api.mjs#L134) (source excerpt; run the full application using the command above):

```javascript
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
```

From [demo.mjs, lines 51-61](demo.mjs#L51) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

Two users exercise ownership, concurrent updates produce one 409, and an injected mid-batch failure leaves the row count unchanged. The application implementation lives in the shared API factory; the numbered demo drives its contracts.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Trace one authenticated POST from token verification to the parameterized INSERT, then explain why neither authentication alone nor a successful response alone proves owner isolation and persistence.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The standalone server, schema migration and container deployment are in applications/task-api and deployment. Use the Docker rehearsal in Prompt 155 for browser/manual HTTP access. Passwords use versioned scrypt records; bearer tokens are never printed.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-152.png)
- [Original lesson and curated constraints](lesson-brief.txt)
