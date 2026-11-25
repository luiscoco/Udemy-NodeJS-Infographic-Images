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

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-093.png)
- [Original lesson and curated constraints](lesson-brief.txt)
