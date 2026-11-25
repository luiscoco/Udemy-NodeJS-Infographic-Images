# Prompt 129: TypeScript compilation and declarations

Category: Tooling · Purpose: Add static checking and distributable JavaScript.
Create a TypeScript library using typescript and baseline-compatible @types/node with NodeNext settings. Emit JavaScript, declarations, and source maps, then verify a separate consumer can import the built package.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 129
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Compilation emits runnable JavaScript, declarations and source maps; the compiled library returns the greeting.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-129.png)
- [Original lesson and curated constraints](lesson-brief.txt)
