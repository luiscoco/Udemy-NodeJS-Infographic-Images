# Prompt 114: Stack traces and source maps

Category: Tooling · Purpose: Relate transformed code failures to original source.
Bundle a small JavaScript program with esbuild and source maps. Trigger an error and compare stack traces with and without --enable-source-maps, verifying the mapped source location.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 114
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The generated bundle fails in both runs; source maps point the second stack back to the original source.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-114.png)
- [Original lesson and curated constraints](lesson-brief.txt)
