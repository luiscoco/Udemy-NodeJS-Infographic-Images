# Prompt 22: Callback conventions and promisification

Category: Node.js core · Purpose: Integrate older asynchronous APIs safely.
Create an error-first callback API and convert it using node:util.promisify. Verify success and failure, and demonstrate why a callback implementation must not complete twice.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 022
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The callback adapter yields 6, and an error-first rejection is handled.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Error-first callbacks report failure in their first argument and success in later arguments. `promisify` adapts that convention into a promise that resolves or rejects.

### Follow the implementation

From [demo.mjs, lines 1-12](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { promisify } from "node:util";
import assert from "node:assert/strict";
function twice(n, cb) {
  queueMicrotask(() => {
    if (n < 0) return cb(Error("negative"));
    cb(null, n * 2);
  });
}
const run = promisify(twice);
console.log(await run(3));
await assert.rejects(run(-1), /negative/);
console.log("negative rejected");
```

### Why this produces the observed result

The callback fires asynchronously through a microtask. The positive input resolves to six, while the negative input becomes a handled rejection rather than a second success value.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the success multiplier and predict the new resolved value. Then explain why passing an Error as a success value in the second argument would break the error-first contract.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-022.png)
- [Original lesson and curated constraints](lesson-brief.txt)
