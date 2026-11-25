# Prompt 52: Asynchronous event listeners

Category: Node.js core · Purpose: Handle failures from event-driven asynchronous work.
Create an EventEmitter example with an async listener that rejects. Demonstrate an appropriate rejection-handling strategy and verify the failure is observed without an unhandled rejection.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 052
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

emit returns immediately; the rejected async listener reaches the configured synchronous error observer.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-052.png)
- [Original lesson and curated constraints](lesson-brief.txt)
