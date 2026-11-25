# Prompt 76: Framework routing and lifecycle

Category: Ecosystem · Purpose: Organize web behavior beyond a raw HTTP callback.
Build a small task API using fastify with route registration, lifecycle hooks, and centralized error handling. Verify successful requests, unknown routes, and an intentionally rejected handler.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 076
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Fastify lifecycle hooks run; thrown async errors become sanitized 500 responses. Add --serve to inspect endpoints manually.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-076.png)
- [Original lesson and curated constraints](lesson-brief.txt)
