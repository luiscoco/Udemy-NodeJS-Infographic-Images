# Prompt 35: Circular dependencies

Category: Node.js core · Purpose: Recognize initialization-order problems.
Construct a small circular ESM dependency that fails during initialization. Refactor the shared responsibility into a third module and verify the public behavior remains unchanged.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 035
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

An eagerly evaluated cycle fails; extracting shared state removes the cycle.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-035.png)
- [Original lesson and curated constraints](lesson-brief.txt)
