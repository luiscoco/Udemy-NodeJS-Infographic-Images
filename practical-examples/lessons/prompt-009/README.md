# Prompt 9: Objects, destructuring, and mutation

Category: JavaScript · Purpose: Avoid accidental modification of shared data.
Build a function that applies defaults to a nested configuration object using destructuring and nullish coalescing. Demonstrate shallow-copy behavior and verify that the chosen implementation preserves the original input.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 009
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Nullish defaults preserve port 0; copied nested state still shares identity unless copied explicitly.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-009.png)
- [Original lesson and curated constraints](lesson-brief.txt)
