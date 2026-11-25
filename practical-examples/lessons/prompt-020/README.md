# Prompt 20: Timers and cancellation

Category: Node.js core · Purpose: Schedule work without assuming exact execution times.
Build an abortable delay with node:timers/promises. Measure actual elapsed time, demonstrate ref versus unref behavior, and verify cancellation leaves no unnecessary timer keeping the process alive.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 020
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

AbortError is observed; manually owned timers are cleared.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-020.png)
- [Original lesson and curated constraints](lesson-brief.txt)
