# Prompt 39: Semantic versioning and updates

Category: Tooling · Purpose: Understand which dependency changes a project permits.
Create a controlled example comparing exact, caret, and tilde version ranges. Use npm inspection commands to explain installed versus allowed versions and verify the effect of an intentional dependency update.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 039
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real semver evaluation demonstrates exact, caret, tilde, and pre-1.0 ranges.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-039.png)
- [Original lesson and curated constraints](lesson-brief.txt)
