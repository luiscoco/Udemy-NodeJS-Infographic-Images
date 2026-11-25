# Prompt 23: Promise aggregation

Category: JavaScript · Purpose: Choose appropriate behavior when several operations complete independently.
Run three simulated operations with Promise.all, Promise.allSettled, and Promise.any. Make one operation fail and assert the different result and rejection behaviors.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 023
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

all rejects, allSettled retains three outcomes, any returns A, and all-rejected any raises AggregateError.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-023.png)
- [Original lesson and curated constraints](lesson-brief.txt)
