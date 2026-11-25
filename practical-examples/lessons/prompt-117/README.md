# Prompt 117: Diagnostics channels

Category: Node.js core · Purpose: Expose instrumentation without coupling business logic to subscribers.
Instrument a reusable operation with node:diagnostics_channel. Add and remove a subscriber, verify start and completion events, and avoid constructing expensive diagnostic payloads when nobody subscribes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 117
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Diagnostics are emitted synchronously only while subscribed; business results remain 6 and 8.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-117.png)
- [Original lesson and curated constraints](lesson-brief.txt)
