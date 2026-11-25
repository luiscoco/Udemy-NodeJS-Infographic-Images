# Prompt 128: Native TypeScript execution

Category: Node.js core · Purpose: Understand the runtime’s limited TypeScript support.
Run a small .ts program containing erasable types directly with Node.js. Demonstrate that a type mismatch can still execute, identify unsupported syntax, and explain why execution is not type checking.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 128
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Native execution strips erasable types and prints 42 despite a static type error; the TypeScript checker rejects it.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-128.png)
- [Original lesson and curated constraints](lesson-brief.txt)
