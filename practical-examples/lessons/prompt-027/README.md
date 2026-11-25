# Prompt 27: Error propagation and cleanup

Category: JavaScript · Purpose: Preserve useful failures across asynchronous layers.
Build a three-layer asynchronous workflow using error causes and try/finally. Inject a failure in each layer and verify that cleanup executes and the original cause remains available.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 027
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Cleanup runs before the caller observes the wrapped error and its original cause.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An error can gain application context without losing its underlying cause. The service wraps a low-level disk failure using Error's `cause` option.

### Follow the implementation

From [demo.mjs, lines 1-20](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
async function read() {
  throw Error("disk unavailable");
}
async function service() {
  try {
    return await read();
  } catch (cause) {
    throw Error("Load failed", { cause });
  } finally {
    console.log("cleanup");
  }
}
try {
  await service();
  assert.fail();
} catch (e) {
  console.log(e.message, e.cause.message);
  assert.equal(e.cause.message, "disk unavailable");
}
```

### Why this produces the observed result

Returning `await read()` inside the try keeps the rejection within this catch/finally scope. Cleanup runs before the caller observes the wrapped failure.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Remove `await` from the return and compare which scope handles the rejection. Explain why `return promise` and `return await promise` differ inside try/catch.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-027.png)
- [Original lesson and curated constraints](lesson-brief.txt)
