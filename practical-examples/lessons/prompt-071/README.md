# Prompt 71: Worker threads

Category: Node.js core · Purpose: Move CPU-heavy work away from the main event loop.
Move a CPU-intensive calculation into node:worker_threads. Compare HTTP responsiveness before and after, and verify worker errors and completion are handled.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 071
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The worker computes 5000050000 on its own JavaScript thread and exits naturally.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A Worker executes JavaScript on another thread with its own runtime state. workerData supplies its input, and a message returns the result without blocking the parent's event loop with the worker's CPU loop.

### Follow the implementation

From [worker.mjs, lines 1-4](worker.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { parentPort, workerData } from "node:worker_threads";
let total = 0;
for (let i = 1; i <= workerData; i++) total += i;
parentPort.postMessage(total);
```

From [demo.mjs, lines 1-16](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Worker } from "node:worker_threads";
import assert from "node:assert/strict";
const worker = new Worker(new URL("./worker.mjs", import.meta.url), {
  workerData: 100000,
});
const answer = await new Promise((resolve, reject) => {
  worker.once("message", resolve);
  worker.once("error", reject);
});
console.log(answer);
assert.equal(answer, 5000050000);
await new Promise((resolve, reject) =>
  worker.once("exit", (code) =>
    code ? reject(Error("Worker failed")) : resolve(),
  ),
);
```

### Why this produces the observed result

The parent observes message, error, and exit separately. Receiving a result is useful, but checking normal exit also verifies that the owned worker finished cleanly.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the input count and compute the expected arithmetic-series sum. Explain which values must be sent explicitly rather than assumed to exist in both threads.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-071.png)
- [Original lesson and curated constraints](lesson-brief.txt)
