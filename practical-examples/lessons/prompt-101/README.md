# Prompt 101: Webhook signatures and replay prevention

Category: Node.js core · Purpose: Verify message authenticity before processing side effects.
Implement webhook verification using crypto.createHmac over the original request bytes. Add timestamp and event-ID checks, and verify modified bodies, stale timestamps, and repeated events are rejected.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 101
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Raw-byte signature verification precedes parsing; a database transaction combines durable deduplication and the business update.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-101.png)
- [Original lesson and curated constraints](lesson-brief.txt)
