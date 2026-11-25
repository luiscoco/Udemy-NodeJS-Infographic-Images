# Prompt 24: Sequential and concurrent await

Category: JavaScript · Purpose: Express dependencies without accidentally serializing independent work.
Implement a workflow containing two independent operations and one dependent operation. Compare unnecessary sequential awaits with correct concurrency, verifying both result correctness and elapsed time.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 024
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both workflows produce 5; independent waits overlap in the concurrent version. Timings are measured.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Awaiting one operation before starting another serializes independent waits. Creating both promises before awaiting `Promise.all` lets their waits overlap while keeping result positions aligned with input order.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, delay } from "../../shared/lab.mjs";
async function a() {
  await delay(40);
  return 2;
}
async function b() {
  await delay(40);
  return 3;
}
let start = performance.now();
const x = await a(),
  y = await b();
console.log("sequential measured ms", performance.now() - start, x + y);
start = performance.now();
const values = await Promise.all([a(), b()]);
console.log(
  "concurrent measured ms",
  performance.now() - start,
  values[0] + values[1],
);
assert.equal(values[0] + values[1], 5);
```

### Why this produces the observed result

Both workflows compute the same sum. Concurrency changes when independent work can progress; it does not make synchronous JavaScript run in parallel on the main thread.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Make the second operation depend on the first operation's result. Explain why that dependency requires sequencing and cannot be removed merely by wrapping calls in Promise.all.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-024.png)
- [Original lesson and curated constraints](lesson-brief.txt)
