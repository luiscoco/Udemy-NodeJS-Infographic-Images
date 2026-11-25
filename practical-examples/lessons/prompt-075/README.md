# Prompt 75: Clustered processes

Category: Node.js core · Purpose: Understand multiple processes serving one application.
Build a two-worker node:cluster HTTP service that returns each worker’s PID. Terminate one worker, verify controlled replacement, and demonstrate why ordinary in-memory state is not shared.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 075
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two separate processes serve a shared listening endpoint. Observed PID distribution is not required to alternate. Shutdown prevents respawn loops.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-075.png)
- [Original lesson and curated constraints](lesson-brief.txt)
