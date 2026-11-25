# Prompt 109: Mocks and deterministic time

Category: Node.js core · Purpose: Test time and dependencies without slow or fragile waits.
Test a retrying function using injected dependencies, built-in function mocks, and timer mocks. Advance time deterministically and verify the attempt limit and cancellation behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 109
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Mock time advances exactly to a deadline without real sleeping; timer mocks restore after the test.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-109.png)
- [Original lesson and curated constraints](lesson-brief.txt)
