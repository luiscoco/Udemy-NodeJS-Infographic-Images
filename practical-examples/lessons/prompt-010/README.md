# Prompt 10: Classes, prototypes, and this

Category: JavaScript · Purpose: Choose suitable object behavior and encapsulation.
Implement a small inventory class with a private field and a prototype method. Pass a method as a callback, reproduce a lost-`this` failure, and verify two appropriate fixes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 010
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

An unbound method fails; binding or calling through its receiver produces 1 then 2.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-010.png)
- [Original lesson and curated constraints](lesson-brief.txt)
