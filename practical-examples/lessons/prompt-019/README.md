# Prompt 19: The libuv worker pool

Category: Node.js core · Purpose: Recognize contention outside the JavaScript execution thread.
Run concurrent filesystem operations and asynchronous crypto.scrypt calls while measuring latency. Compare two startup values of UV_THREADPOOL_SIZE and explain the observed contention without assuming more threads always improve performance.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 019
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Each fresh process measures eight crypto jobs sharing libuv resources; more threads are not guaranteed to improve elapsed time.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Some asynchronous Node APIs use libuv's shared worker pool. Concurrent scrypt operations and a filesystem operation can compete for that pool even though their JavaScript callers do not block synchronously.

### Follow the implementation

From [pool.mjs, lines 1-10](pool.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { readFile } from "node:fs/promises";
import { scrypt } from "node:crypto";
import { promisify } from "node:util";
const run = promisify(scrypt);
const start = performance.now();
await Promise.all([
  ...Array.from({ length: 8 }, () => run("fixture", "salt", 64)),
  readFile(new URL(import.meta.url)),
]);
console.log("elapsed ms:", Math.round(performance.now() - start));
```

From [demo.mjs, lines 1-10](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { scrypt } from "node:crypto";
import { promisify } from "node:util";
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const size of ["2", "8"]) {
  const r = await spawnNode(["pool.mjs"], {
    env: { ...process.env, UV_THREADPOOL_SIZE: size },
  });
  console.log("threads", size, r.stdout);
  assert.equal(r.code, 0);
}
```

### Why this produces the observed result

The harness starts fresh processes with different `UV_THREADPOOL_SIZE` values so the setting is present at startup. More pool threads can change contention, but CPU limits and overhead mean a speedup is not guaranteed.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Repeat both pool sizes several times and compare elapsed-time distributions. Explain why a worker-pool setting is different from creating Worker threads to execute JavaScript.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-019.png)
- [Original lesson and curated constraints](lesson-brief.txt)
