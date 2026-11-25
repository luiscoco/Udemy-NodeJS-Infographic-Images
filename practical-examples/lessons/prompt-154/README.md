# Prompt 154: Background-Job Processing System

Category: EcosystemPurpose: Make asynchronous work recoverable under partial failure.
Learning goals: Durable queues, idempotency, scheduling, retries, bounded concurrency, transactional outbox, and failure inspection.
Implementation prompt:
Build a report-processing system using fastify, pg, and bullmq configured with Redis. Accept requests through an API, persist business state and an outbox entry transactionally, and process jobs with bounded retries and idempotent result publication. Include scheduling, progress reporting, and a script that interrupts workers at controlled points.
Acceptance criteria:
Killing a worker during processing permits recovery.
Repeating the same logical operation produces one durable business result.
Transient failures retry within a configured budget.
Permanent failures become visible after the attempt limit.
Worker concurrency stays within the configured bound.
Scheduling has explicit time-zone, overlap, and restart policies.
Queue delivery behavior and business-effect guarantees are explained separately.
Suggested point: After Module 16.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 154
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A separate worker process really exits after publishing its result but before ACK. Recovery retries the stalled job and the database proves one durable effect.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-154.png)
- [Original lesson and curated constraints](lesson-brief.txt)
