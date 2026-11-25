# Prompt 62: Fetch, cancellation, and HTTP errors

Category: Node.js core · Purpose: Make reliable outbound web requests.
Build a client using native fetch against a local fault-injection server. Handle non-success HTTP statuses, invalid JSON, cancellation, and timeouts, verifying response bodies are consumed or canceled appropriately.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 062
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A local fault server demonstrates HTTP status errors, invalid JSON and cancellation without relying on the public internet.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-062.png)
- [Original lesson and curated constraints](lesson-brief.txt)
