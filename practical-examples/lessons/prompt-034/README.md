# Prompt 34: Module-relative assets and JSON imports

Category: Node.js core · Purpose: Locate assets independently of the working directory.
Load a text asset relative to import.meta.url and import JSON using the baseline’s supported import attributes. Run the application from another directory and verify both resources still load.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 034
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Module-relative assets load consistently even when the shell current directory changes.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-034.png)
- [Original lesson and curated constraints](lesson-brief.txt)
