# Prompt 71: Worker threads

Category: Node.js core · Purpose: Move CPU-heavy work away from the main event loop.
Move a CPU-intensive calculation into node:worker_threads. Compare HTTP responsiveness before and after, and verify worker errors and completion are handled.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 071
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The worker computes 5000050000 on its own JavaScript thread and exits naturally.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-071.png)
- [Original lesson and curated constraints](lesson-brief.txt)
