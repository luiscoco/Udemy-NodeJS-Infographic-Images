# Prompt 116: Asynchronous request context

Category: Node.js core · Purpose: Preserve correlation information across asynchronous operations.
Use AsyncLocalStorage to carry a request ID through promises, timers, and database-like callbacks. Run overlapping requests and verify their context values never mix.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 116
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Overlapping requests retain their own IDs and the outer context remains undefined.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-116.png)
- [Original lesson and curated constraints](lesson-brief.txt)
