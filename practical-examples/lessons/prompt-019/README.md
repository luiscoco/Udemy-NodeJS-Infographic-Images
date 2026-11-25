# Prompt 19: The libuv worker pool

Category: Node.js core · Purpose: Recognize contention outside the JavaScript execution thread.
Run concurrent filesystem operations and asynchronous crypto.scrypt calls while measuring latency. Compare two startup values of UV_THREADPOOL_SIZE and explain the observed contention without assuming more threads always improve performance.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 019
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Each fresh process measures eight crypto jobs sharing libuv resources; more threads are not guaranteed to improve elapsed time.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-019.png)
- [Original lesson and curated constraints](lesson-brief.txt)
