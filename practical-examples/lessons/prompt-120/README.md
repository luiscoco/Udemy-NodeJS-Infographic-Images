# Prompt 120: Distributed tracing

Category: Ecosystem · Purpose: Follow one operation across service boundaries.
Instrument two local HTTP services using @opentelemetry/api, @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, and a console exporter from @opentelemetry/sdk-trace-base. Verify a request produces related spans, using the packages’ documented ESM initialization.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 120
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two actual Node processes propagate W3C trace context through HTTP. Trace IDs and parent-child relationships are asserted.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-120.png)
- [Original lesson and curated constraints](lesson-brief.txt)
