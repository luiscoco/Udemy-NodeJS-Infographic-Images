# Prompt 150: Iterable Streams API — experimental

Category: Node.js core · Purpose: Compare a newer streaming interface with established alternatives.
Implement a small transformation using node:stream/iter with its required experimental flag. Verify output, cancellation, and slow-consumer behavior, then compare its interface with a stable classic-stream pipeline.
This API is separate from ordinary, stable for await...of consumption of Node streams. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 150
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both actual stream interfaces produce uppercase output. The experimental iterable API and stable classic pipeline remain distinct.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-150.png)
- [Original lesson and curated constraints](lesson-brief.txt)
