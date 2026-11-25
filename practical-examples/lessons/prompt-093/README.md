# Prompt 93: Durable background jobs

Category: Ecosystem · Purpose: Process work independently of an HTTP request.
Process report-generation jobs using bullmq configured with Redis. Bound concurrency and attempts, terminate a worker mid-job, and verify idempotent output after recovery or redelivery.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 093
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The worker fails twice and succeeds within a three-attempt retry budget; job resources are closed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A durable queue separates request submission from worker execution. Each failed attempt consumes part of a bounded retry budget, with exponential delay between retries.

### Follow the implementation

From [demo.mjs, lines 1-20](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { queueLab } from "../../shared/jobs.mjs";
import assert from "node:assert/strict";
let attempts = 0;
await using lab = await queueLab(async (job) => {
  attempts++;
  if (job.attemptsMade < 2) throw Error("transient fixture");
  return { reportId: job.data.reportId };
});
const job = await lab.queue.add(
  "generate",
  { reportId: "r1" },
  {
    jobId: "report-r1",
    attempts: 3,
    backoff: { type: "exponential", delay: 10 },
  },
);
const value = await job.waitUntilFinished(lab.events, 10000);
console.log({ value, attempts });
assert.equal(attempts, 3);
```

### Why this produces the observed result

The worker intentionally fails twice, and the third attempt produces the result. Job completion is awaited through queue events, while closing workers and connections prevents background resources from leaking.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Set attempts to two and handle the expected terminal failure. Explain why retrying every error forever would turn a permanent bug into an unbounded workload.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-093.png)
- [Original lesson and curated constraints](lesson-brief.txt)
