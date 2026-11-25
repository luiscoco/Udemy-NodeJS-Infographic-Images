# Prompt 23: Promise aggregation

Category: JavaScript · Purpose: Choose appropriate behavior when several operations complete independently.
Run three simulated operations with Promise.all, Promise.allSettled, and Promise.any. Make one operation fail and assert the different result and rejection behaviors.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 023
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

all rejects, allSettled retains three outcomes, any returns A, and all-rejected any raises AggregateError.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Promise combinators answer different questions: `all` requires every success, `allSettled` records every outcome, and `any` returns the first fulfillment.

### Follow the implementation

From [demo.mjs, lines 1-14](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const work = () => [
  Promise.resolve("A"),
  Promise.reject(Error("B failed")),
  Promise.resolve("C"),
];
try {
  await Promise.all(work());
} catch (e) {
  console.log("all:", e.message);
}
console.log((await Promise.allSettled(work())).map((x) => x.status));
console.log(await Promise.any(work()));
await assert.rejects(Promise.any([Promise.reject(Error("x"))]), AggregateError);
```

### Why this produces the observed result

A rejection from `all` does not cancel sibling work. `any` rejects with AggregateError only when every input rejects, preserving the distinction between first success and first settlement.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Replace both successful promises with rejections. Predict the behavior of all three combinators and inspect the errors inside AggregateError.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-023.png)
- [Original lesson and curated constraints](lesson-brief.txt)
