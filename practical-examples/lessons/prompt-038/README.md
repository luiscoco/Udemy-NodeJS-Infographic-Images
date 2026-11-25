# Prompt 38: Lockfiles and reproducible installation

Category: Tooling · Purpose: Recreate the intended dependency graph.
Generate a lockfile and verify installation with npm ci in a clean directory. Deliberately introduce a manifest mismatch and demonstrate the expected failure and correct repair workflow.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 038
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Offline local dependency installation creates a real lockfile; ci succeeds, then rejects manifest drift.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-038.png)
- [Original lesson and curated constraints](lesson-brief.txt)
