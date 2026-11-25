# Prompt 22: Callback conventions and promisification

Category: Node.js core · Purpose: Integrate older asynchronous APIs safely.
Create an error-first callback API and convert it using node:util.promisify. Verify success and failure, and demonstrate why a callback implementation must not complete twice.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 022
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The callback adapter yields 6, and an error-first rejection is handled.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-022.png)
- [Original lesson and curated constraints](lesson-brief.txt)
