# Prompt 95: Transactional outbox

Category: Ecosystem · Purpose: Coordinate database changes with eventual message delivery.
Implement an outbox using pg, PostgreSQL, and bullmq with Redis. Commit business data and an outbox row together, crash the dispatcher at different points, and verify eventual processing with deduplicated business effects.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 095
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two deliveries produce one durable business effect, protected by a PostgreSQL uniqueness constraint and transaction.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-095.png)
- [Original lesson and curated constraints](lesson-brief.txt)
