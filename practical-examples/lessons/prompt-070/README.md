# Prompt 70: Interprocess communication

Category: Node.js core · Purpose: Coordinate separate Node.js processes.
Build a parent and forked child communicating through request IDs and replies. Add request deadlines and simulate a child crash, verifying pending requests fail rather than hang.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 070
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Request IDs correlate replies; a missing reply times out and removes its pending entry.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-070.png)
- [Original lesson and curated constraints](lesson-brief.txt)
