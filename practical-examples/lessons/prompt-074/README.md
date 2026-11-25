# Prompt 74: Shared memory and Atomics

Category: JavaScript · Purpose: Coordinate shared state across execution threads.
Use SharedArrayBuffer and Atomics to maintain a counter across workers. Reproduce a race without atomic operations, verify the corrected total, and avoid blocking waits on the main thread.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 074
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two workers update one shared counter without a read-modify-write race.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

SharedArrayBuffer lets threads access the same storage, so ordinary read-modify-write increments can race. Atomics supplies coordinated operations for the shared integer view.

### Follow the implementation

From [worker.mjs, lines 1-3](worker.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { workerData } from "node:worker_threads";
const view = new Int32Array(workerData);
for (let i = 0; i < 100000; i++) Atomics.add(view, 0, 1);
```

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Worker } from "node:worker_threads";
import assert from "node:assert/strict";
const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
await Promise.all(
  [1, 2].map(
    () =>
      new Promise((resolve, reject) => {
        const worker = new Worker(new URL("./worker.mjs", import.meta.url), {
          workerData: shared,
        });
        worker.on("error", reject);
        worker.on("exit", (code) =>
          code ? reject(Error("Worker failed")) : resolve(),
        );
      }),
  ),
);
console.log(Atomics.load(new Int32Array(shared), 0));
assert.equal(Atomics.load(new Int32Array(shared), 0), 200000);
```

### Why this produces the observed result

Both workers receive the same buffer and the parent waits for their exits before reading the total. The result checks coordination, not just successful worker startup.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the worker's Atomics.add, then replace it temporarily with a plain increment. Explain why a coincidentally correct run would not prove the plain version race-free.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-074.png)
- [Original lesson and curated constraints](lesson-brief.txt)
