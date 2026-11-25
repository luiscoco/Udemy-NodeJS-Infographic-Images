# Prompt 28: Async generators

Category: JavaScript · Purpose: Consume asynchronous sequences lazily.
Implement an async generator over a simulated paginated data source. Stop consumption early with for await...of and verify that later pages are not requested and cleanup runs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 028
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Only the first page is requested; breaking async iteration runs cleanup.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An async generator fetches or computes each page as the consumer requests it. `for await...of` waits for each yielded value instead of preloading all pages.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
let requested = 0,
  cleaned = false;
async function* pages() {
  try {
    for (let p = 1; p <= 5; p++) {
      requested++;
      yield [p * 10];
    }
  } finally {
    cleaned = true;
    console.log("cleanup");
  }
}
for await (const page of pages()) {
  console.log(page);
  break;
}
console.log({ requested, cleaned });
assert.equal(requested, 1);
assert.equal(cleaned, true);
```

### Why this produces the observed result

Breaking the loop closes the iterator and executes `finally`; the counters prove only one page was requested. This pattern is useful when a client stops reading early.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Consume two pages before breaking and predict `requested`. Explain where a network cursor or open file should be released in a real paginated implementation.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-028.png)
- [Original lesson and curated constraints](lesson-brief.txt)
