# Prompt 3: Minimal project structure

Category: Tooling · Purpose: Establish a small, understandable project foundation.
Create an ES-module project with src, test, a README, and npm scripts for running and testing. Include one exported function and an assertion that can run from a clean checkout.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 003
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The application prints 5 and its addition test passes.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-003.png)
- [Original lesson and curated constraints](lesson-brief.txt)
