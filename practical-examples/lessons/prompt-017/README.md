# Prompt 17: Event-loop phases

Category: Node.js core · Purpose: Reason about when callbacks can execute.
Create an experiment using a filesystem callback, setTimeout, and setImmediate. Repeat it inside and outside an I/O callback, recording observations while distinguishing guaranteed ordering from timing-dependent results.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 017
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Inside the I/O callback immediate precedes timeout. Top-level timeout/immediate order is deliberately not asserted.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-017.png)
- [Original lesson and curated constraints](lesson-brief.txt)
