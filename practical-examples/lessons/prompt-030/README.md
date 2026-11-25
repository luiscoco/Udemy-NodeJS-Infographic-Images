# Prompt 30: CommonJS

Category: Node.js core · Purpose: Understand existing Node.js packages and applications.
Build a small .cjs application using require and module.exports. Demonstrate module caching with a stateful export and verify how repeated imports share that state.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 030
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Resolved CommonJS module instances are cached; the two calls share the same counter.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-030.png)
- [Original lesson and curated constraints](lesson-brief.txt)
