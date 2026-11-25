# Prompt 74: Shared memory and Atomics

Category: JavaScript · Purpose: Coordinate shared state across execution threads.
Use SharedArrayBuffer and Atomics to maintain a counter across workers. Reproduce a race without atomic operations, verify the corrected total, and avoid blocking waits on the main thread.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 074
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two workers update one shared counter without a read-modify-write race.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-074.png)
- [Original lesson and curated constraints](lesson-brief.txt)
