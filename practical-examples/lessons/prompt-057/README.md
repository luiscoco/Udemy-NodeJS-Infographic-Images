# Prompt 57: Web Streams interoperability

Category: Node.js core · Purpose: Connect browser-style APIs with Node stream APIs.
Fetch a large response from a local server and connect its Web Stream body to a Node writable using supported adapters. Verify cancellation propagates and output matches the source.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 057
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real local fetch Web ReadableStream is adapted into a Node pipeline and published only after success.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-057.png)
- [Original lesson and curated constraints](lesson-brief.txt)
