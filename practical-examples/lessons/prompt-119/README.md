# Prompt 119: Application metrics

Category: Ecosystem · Purpose: Observe latency, errors, and workload over time.
Use prom-client to expose request counters, a duration histogram, and an in-flight gauge. Verify metrics change under success and failure while labels avoid user IDs and unbounded URL values.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 119
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual Prometheus text includes bounded success/error labels, histogram samples and an in-flight gauge that returns to zero.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-119.png)
- [Original lesson and curated constraints](lesson-brief.txt)
