# Prompt 111: Coverage — experimental

Category: Node.js core · Purpose: Identify behavior that tests have not exercised.
Collect coverage with node --test --experimental-test-coverage. Find an uncovered failure branch, add a behavior-focused test, and explain why higher coverage alone does not establish correctness.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 111
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real coverage report changes when a negative-total branch is tested. No coverage percentage is fabricated.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-111.png)
- [Original lesson and curated constraints](lesson-brief.txt)
