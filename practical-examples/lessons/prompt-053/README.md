# Prompt 53: Readable and writable backpressure

Category: Node.js core · Purpose: Keep producer speed aligned with consumer capacity.
Connect a fast producer to a deliberately slow writable stream. Respect write() results and drain, and verify buffered data remains bounded as total processed input increases.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 053
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The slow sink receives every chunk exactly once while the producer honors drain. highWaterMark is a threshold, not a universal memory cap.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-053.png)
- [Original lesson and curated constraints](lesson-brief.txt)
