# Prompt 108: Integration tests

Category: Ecosystem · Purpose: Verify real collaboration between application components.
Test a fastify API backed by PostgreSQL using pg and node:test. Create isolated fixture data, exercise a rollback path, and verify the suite can run repeatedly without relying on test order.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 108
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real Fastify request persists a row that is verified through a separate SQL query; an isolated schema is removed afterward.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-108.png)
- [Original lesson and curated constraints](lesson-brief.txt)
