# Prompt 125: Retry budgets and backoff

Category: Node.js core · Purpose: Recover from transient failures without amplifying an outage.
Implement retries for an idempotent HTTP operation with exponential backoff, jitter, a maximum attempt count, and an overall deadline. Verify permanent errors are not retried and cancellation stops pending attempts.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 125
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Transient failures consume three of four attempts; permanent errors do not retry; a pre-aborted caller starts no work.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-125.png)
- [Original lesson and curated constraints](lesson-brief.txt)
