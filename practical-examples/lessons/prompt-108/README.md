# Prompt 108: Integration tests

Category: Ecosystem · Purpose: Verify real collaboration between application components.
Test a fastify API backed by PostgreSQL using pg and node:test. Create isolated fixture data, exercise a rollback path, and verify the suite can run repeatedly without relying on test order.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 108
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real Fastify request persists a row that is verified through a separate SQL query; an isolated schema is removed afterward.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An integration test follows a real request through framework validation, authentication, and database persistence. It checks a boundary that a mocked repository test cannot establish.

### Follow the implementation

From [demo.mjs, lines 1-24](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

After the API returns 201, a separate SQL query verifies the stored title. An isolated schema and explicit application close keep the test repeatable without sharing lesson data.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the handler's persistence behavior while leaving its response shape intact. Explain why the separate database assertion detects a false successful response.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-108.png)
- [Original lesson and curated constraints](lesson-brief.txt)
