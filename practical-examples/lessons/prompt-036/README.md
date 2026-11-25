# Prompt 36: Package metadata and dependency types

Category: Tooling · Purpose: Declare how a package should be installed and consumed.
Create a package manifest demonstrating dependencies, development dependencies, peer dependencies, optional dependencies, and an engine requirement. Use tiny local fixture packages and verify which relationships appear in the installed dependency tree.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 036
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The manifest separates dependency responsibilities and the optional feature has an actual fallback.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-036.png)
- [Original lesson and curated constraints](lesson-brief.txt)
