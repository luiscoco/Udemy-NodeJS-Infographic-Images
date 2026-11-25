# Prompt 18: Microtasks and next-tick callbacks

Category: Node.js core · Purpose: Diagnose scheduling surprises and starvation.
Compare promise callbacks, queueMicrotask, and legacy process.nextTick in separate ESM and CommonJS programs. Demonstrate bounded starvation and verify that yielding restores timer progress.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 018
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

CJS prints sync,nextTick,promise,microtask; ESM prints sync,promise,microtask,nextTick for this top-level fixture.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Promise reactions and `queueMicrotask` use the microtask queue; `process.nextTick` uses a separate Node queue. Top-level CommonJS and ES module evaluation enter these queues from different execution contexts.

### Follow the implementation

From [order.cjs, lines 1-4](order.cjs#L1) (source excerpt; run the full application using the command above):

```javascript
console.log("sync");
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("microtask"));
```

From [order.mjs, lines 1-4](order.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
console.log("sync");
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("microtask"));
```

### Why this produces the observed result

The harness runs otherwise comparable `.cjs` and `.mjs` fixtures in separate processes. Their recorded orders describe these fixtures and must not be generalized to every nested callback.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare `order.cjs` with `order.mjs`, then schedule the same operations inside a timer. Describe which evaluation context changed before making a new ordering prediction.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-018.png)
- [Original lesson and curated constraints](lesson-brief.txt)
