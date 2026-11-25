# Prompt 56: Async iteration over streams

Category: Node.js core · Purpose: Process streams using familiar asynchronous control flow.
Consume a file stream with for await...of, stopping after a configured byte count. Verify early termination releases the resource and compare this behavior with full consumption.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 056
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Early async-iterator break destroys the source and releases its file handle.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-056.png)
- [Original lesson and curated constraints](lesson-brief.txt)
