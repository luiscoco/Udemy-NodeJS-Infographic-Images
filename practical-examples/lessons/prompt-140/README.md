# Prompt 140: Horizontal scaling

Category: Tooling · Purpose: Run multiple instances without relying on local process state.
Run two application replicas behind an NGINX reverse proxy with shared state in Redis and PostgreSQL. Verify requests reach both replicas and calculate a database connection budget across all instances.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 140
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two actual app instances with independent pools and a shared signing key read the same PostgreSQL task.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Horizontal scaling adds independent application instances that share durable state and compatible authentication configuration. A task written by one instance must be readable through another.

### Follow the implementation

From [demo.mjs, lines 1-33](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

Each replica has its own bounded connection pool, so database demand grows with replica count. The example totals pool capacity instead of budgeting only one process.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Calculate the total connection budget for five replicas plus worker and maintenance connections. Explain why simply increasing replica count can overload a shared database.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The example validates shared data and a connection-budget allocation. For the real two-container reverse-proxy rehearsal, run Prompt 138 or 155; deployment/nginx.conf supplies the NGINX upstream.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-140.png)
- [Original lesson and curated constraints](lesson-brief.txt)
