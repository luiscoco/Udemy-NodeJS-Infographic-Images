# Prompt 51: EventEmitter lifecycle

Category: Node.js core · Purpose: Connect components through in-process events.
Implement a job object using EventEmitter with progress, completion, and error events. Verify listener ordering, once, listener removal, and cleanup after repeated jobs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 051
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The once listener fires once and the owned progress listener is removed.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-051.png)
- [Original lesson and curated constraints](lesson-brief.txt)
