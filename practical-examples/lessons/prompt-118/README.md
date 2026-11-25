# Prompt 118: Runtime measurements

Category: Node.js core · Purpose: Detect pressure on the event loop.
Measure operation duration, event-loop utilization, and event-loop delay using node:perf_hooks. Introduce blocking work and verify the measurements reveal it, including correct conversion of reported units.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 118
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual duration, utilization and delay reveal blocking work. Delay nanoseconds are converted to milliseconds.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-118.png)
- [Original lesson and curated constraints](lesson-brief.txt)
