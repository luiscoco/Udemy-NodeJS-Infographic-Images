# Prompt 139: Health checks

Category: Node.js core · Purpose: Communicate whether an instance should receive traffic or restart.
Implement separate readiness and liveness endpoints in a Node.js service. Simulate startup, database unavailability, and shutdown, verifying readiness changes without automatically treating every dependency outage as a process failure.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 139
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Readiness changes independently of liveness. Dependency failure is injected at the pool boundary, not falsely reported as a physical database outage.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Liveness asks whether a process is alive; readiness asks whether it can safely receive useful traffic now. Startup, dependency failure, and shutdown can make readiness false without making liveness false.

### Follow the implementation

From [demo.mjs, lines 1-31](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

The lesson injects a pool-boundary failure, checks ready returns 503 while live returns 200, and restores the dependency. It does not claim to have stopped the physical database server.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Set the stopping state while the pool remains healthy. Explain why a load balancer should stop routing new requests even though the process must remain alive to drain accepted work.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-139.png)
- [Original lesson and curated constraints](lesson-brief.txt)
