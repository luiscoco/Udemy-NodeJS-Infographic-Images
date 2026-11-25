# Prompt 26: Cancellation and deadlines

Category: Node.js core · Purpose: Stop work when its caller no longer needs the result.
Build an operation accepting an AbortSignal, combining caller cancellation with a deadline using supported AbortSignal APIs. Verify early cancellation, timeout, successful completion, and cleanup in all three paths.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 026
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The timers promise rejects AbortError; the combined signal records TimeoutError as its deadline reason.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A caller cancellation and a deadline are independent reasons to stop. `AbortSignal.any` combines them so the awaited operation can react to whichever occurs first.

### Follow the implementation

From [demo.mjs, lines 1-11](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, delay } from "../../shared/lab.mjs";
const caller = new AbortController();
const combined = AbortSignal.any([caller.signal, AbortSignal.timeout(30)]);
try {
  await delay(500, null, { signal: combined });
  assert.fail();
} catch (e) {
  console.log({ thrown: e.name, reason: combined.reason.name });
  assert.equal(e.name, "AbortError");
  assert.equal(combined.reason.name, "TimeoutError");
}
```

### Why this produces the observed result

The timer promise rejects AbortError, while `combined.reason` retains the more specific TimeoutError. That distinction lets application code classify the cause without confusing it with the wrapper rejection.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Abort the caller immediately before starting the wait. Compare `combined.reason` with the deadline-driven run and explain why no work should start for an already aborted signal.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-026.png)
- [Original lesson and curated constraints](lesson-brief.txt)
