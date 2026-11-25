# Prompt 72: Worker pools

Category: Ecosystem · Purpose: Reuse workers and control CPU-work admission.
Use piscina to process CPU-heavy jobs with a fixed worker limit and bounded queue. Overload the pool and verify excess work is rejected or delayed according to an explicit policy.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 072
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A bounded two-thread pool computes a result and rejects excess queued work.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A worker pool reuses a bounded number of threads instead of creating one per task. The external Piscina library adds scheduling and a maximum queue length.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Piscina from "piscina";
import assert from "node:assert/strict";
const pool = new Piscina({
  filename: new URL("./worker.mjs", import.meta.url).href,
  minThreads: 2,
  maxThreads: 2,
  maxQueue: 4,
});
try {
  assert.equal(await pool.run(100000), 5000050000);
  const outcomes = await Promise.allSettled(
    Array.from({ length: 12 }, () => pool.run(1000000)),
  );
  console.log({
    fulfilled: outcomes.filter((x) => x.status === "fulfilled").length,
    rejected: outcomes.filter((x) => x.status === "rejected").length,
  });
  assert.ok(outcomes.some((x) => x.status === "rejected"));
} finally {
  await pool.destroy();
}
```

### Why this produces the observed result

Two threads and four waiting slots establish an overload policy. Submitting a burst produces some rejections, and destroying the pool releases the threads at the end.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Reduce maxQueue and submit the same burst. Compare rejected counts without relying on an exact scheduling-dependent count, then explain why an unbounded queue can exhaust memory.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-072.png)
- [Original lesson and curated constraints](lesson-brief.txt)
