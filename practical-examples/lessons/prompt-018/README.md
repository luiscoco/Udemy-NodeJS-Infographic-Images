# Prompt 18: Microtasks and next-tick callbacks

Category: Node.js core · Purpose: Diagnose scheduling surprises and starvation.
Compare promise callbacks, queueMicrotask, and legacy process.nextTick in separate ESM and CommonJS programs. Demonstrate bounded starvation and verify that yielding restores timer progress.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 018
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

CJS prints sync,nextTick,promise,microtask; ESM prints sync,promise,microtask,nextTick for this top-level fixture.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-018.png)
- [Original lesson and curated constraints](lesson-brief.txt)
