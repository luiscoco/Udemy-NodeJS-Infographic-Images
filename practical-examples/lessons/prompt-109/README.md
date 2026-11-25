# Prompt 109: Mocks and deterministic time

Category: Node.js core · Purpose: Test time and dependencies without slow or fragile waits.
Test a retrying function using injected dependencies, built-in function mocks, and timer mocks. Advance time deterministically and verify the attempt limit and cancellation behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 109
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Mock time advances exactly to a deadline without real sleeping; timer mocks restore after the test.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Mock time lets a test examine a deadline without sleeping in real time. A mocked callback records calls independently of the timer scheduler.

### Follow the implementation

From [timers.test.mjs, lines 1-11](timers.test.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";
import assert from "node:assert/strict";
test("deadline boundaries", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const call = t.mock.fn();
  setTimeout(call, 100);
  t.mock.timers.tick(99);
  assert.equal(call.mock.callCount(), 0);
  t.mock.timers.tick(1);
  assert.equal(call.mock.callCount(), 1);
});
```

### Why this produces the observed result

Advancing by 99 milliseconds leaves the callback untouched; advancing by one more triggers it exactly once. Test-scoped mocks restore the real APIs after the test.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Advance by 100 in one step, then by another 100. Predict the call count for a one-shot timer and compare it with a repeating timer's intended contract.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-109.png)
- [Original lesson and curated constraints](lesson-brief.txt)
