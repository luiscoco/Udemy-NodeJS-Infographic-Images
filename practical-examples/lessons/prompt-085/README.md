# Prompt 85: Embedded SQLite — experimental

Category: Node.js core · Purpose: Explore a database without a separate server.
Build a local notes CLI using the experimental node:sqlite module and its current Database class. Use prepared statements, verify persistence after restart, and measure the effect of synchronous queries on an active timer.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 085
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Reopening the real SQLite file preserves the first record; each execution inserts another record. Database operations remain synchronous.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-085.png)
- [Original lesson and curated constraints](lesson-brief.txt)
