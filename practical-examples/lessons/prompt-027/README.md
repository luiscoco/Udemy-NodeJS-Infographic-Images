# Prompt 27: Error propagation and cleanup

Category: JavaScript · Purpose: Preserve useful failures across asynchronous layers.
Build a three-layer asynchronous workflow using error causes and try/finally. Inject a failure in each layer and verify that cleanup executes and the original cause remains available.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 027
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Cleanup runs before the caller observes the wrapped error and its original cause.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-027.png)
- [Original lesson and curated constraints](lesson-brief.txt)
