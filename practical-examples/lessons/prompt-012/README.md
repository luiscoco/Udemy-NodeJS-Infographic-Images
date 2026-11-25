# Prompt 12: Iterators and generators

Category: JavaScript · Purpose: Produce values lazily instead of allocating entire datasets.
Implement a custom iterable and a generator that yields a large numeric range. Consume only the first ten values and verify that the remaining values were never generated.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 012
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Only ten values are produced; breaking the loop executes generator cleanup.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A generator produces values when the consumer requests them. Yielding ten values from a million-value range does not require building the other values or storing a million-element array.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
let produced = 0,
  cleaned = false;
function* range(n) {
  try {
    for (let i = 0; i < n; i++) {
      produced++;
      yield i;
    }
  } finally {
    cleaned = true;
  }
}
const first = [];
for (const n of range(1_000_000)) {
  first.push(n);
  if (first.length === 10) break;
}
console.log({ first, produced, cleaned });
assert.equal(produced, 10);
assert.equal(cleaned, true);
```

### Why this produces the observed result

Breaking a `for...of` loop closes the generator and executes its `finally` block. The `produced` and `cleaned` assertions show both lazy production and resource cleanup.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the break threshold from ten to three. Predict both counters and explain why moving allocation of a million-element array before the first yield would lose the memory benefit.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-012.png)
- [Original lesson and curated constraints](lesson-brief.txt)
