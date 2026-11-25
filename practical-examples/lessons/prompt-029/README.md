# Prompt 29: ES modules

Category: Node.js core · Purpose: Structure applications with explicit module boundaries.
Create an ESM application using "type": "module", named exports, and explicit relative extensions. Introduce a missing-extension error and verify the corrected module graph runs successfully.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 029
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

ESM imports with explicit extensions work; Node rejects the extensionless fixture.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-029.png)
- [Original lesson and curated constraints](lesson-brief.txt)
