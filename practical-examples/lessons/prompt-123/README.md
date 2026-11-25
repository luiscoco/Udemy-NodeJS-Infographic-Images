# Prompt 123: Load testing and bottlenecks

Category: Tooling · Purpose: Measure application behavior at realistic concurrency.
Load-test a PostgreSQL-backed endpoint using autocannon and pg. Report latency percentiles, throughput, and errors; inspect the query plan and verify the effect of a justified index.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 123
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual HTTP timings and EXPLAIN ANALYZE plans are measured before and after an index. The lab does not assume the index always wins.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-123.png)
- [Original lesson and curated constraints](lesson-brief.txt)
