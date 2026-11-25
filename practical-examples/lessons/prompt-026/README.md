# Prompt 26: Cancellation and deadlines

Category: Node.js core · Purpose: Stop work when its caller no longer needs the result.
Build an operation accepting an AbortSignal, combining caller cancellation with a deadline using supported AbortSignal APIs. Verify early cancellation, timeout, successful completion, and cleanup in all three paths.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 026
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The timers promise rejects AbortError; the combined signal records TimeoutError as its deadline reason.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-026.png)
- [Original lesson and curated constraints](lesson-brief.txt)
