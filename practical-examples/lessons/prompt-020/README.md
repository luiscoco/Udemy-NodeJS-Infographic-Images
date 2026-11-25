# Prompt 20: Timers and cancellation

Category: Node.js core · Purpose: Schedule work without assuming exact execution times.
Build an abortable delay with node:timers/promises. Measure actual elapsed time, demonstrate ref versus unref behavior, and verify cancellation leaves no unnecessary timer keeping the process alive.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 020
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

AbortError is observed; manually owned timers are cleared.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

AbortController communicates cancellation to APIs that accept a signal. Aborting the timer promise makes its await reject with AbortError, which the application handles as an expected outcome.

### Follow the implementation

From [demo.mjs, lines 1-12](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, delay } from "../../shared/lab.mjs";
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 30);
try {
  await delay(1000, null, { signal: controller.signal });
  assert.fail("must cancel");
} catch (e) {
  assert.equal(e.name, "AbortError");
  console.log(e.name);
} finally {
  clearTimeout(timer);
}
```

### Why this produces the observed result

The manually created timeout is an owned resource and is cleared in `finally`. A cancellation signal does not forcibly interrupt arbitrary synchronous JavaScript that never checks it.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Make the deadline longer than the awaited delay and update the expected outcome. Explain why the existing `assert.fail` then becomes reachable.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-020.png)
- [Original lesson and curated constraints](lesson-brief.txt)
