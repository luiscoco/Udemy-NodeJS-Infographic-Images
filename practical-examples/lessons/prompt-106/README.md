# Prompt 106: Unit tests

Category: Node.js core · Purpose: Verify small pieces of behavior independently.
Test a configuration parser using node:test and node:assert/strict. Cover valid values, boundaries, and malformed input, and introduce one deliberate defect to verify the tests detect it.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 106
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Boundary tests check valid ports and reject malformed/unsafe input.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-106.png)
- [Original lesson and curated constraints](lesson-brief.txt)
