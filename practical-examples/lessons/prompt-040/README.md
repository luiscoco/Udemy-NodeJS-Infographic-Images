# Prompt 40: npm workspaces

Category: Tooling · Purpose: Develop related packages in one repository.
Create npm workspaces containing a reusable library and a CLI consumer. Run targeted and repository-wide scripts, then verify a change in the library is consumed without publishing it.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 040
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two real local workspaces link without workspace:* syntax; the CLI imports the math package.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-040.png)
- [Original lesson and curated constraints](lesson-brief.txt)
