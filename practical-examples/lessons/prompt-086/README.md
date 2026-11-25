# Prompt 86: PostgreSQL and connection pooling

Category: Ecosystem · Purpose: Access a relational database with controlled connection usage.
Build parameterized CRUD operations using pg and a local PostgreSQL service. Configure a bounded pool, test injection-like input as ordinary data, and verify connections are released after errors.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 086
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The parameterized attack-shaped title is stored as ordinary data and the table remains intact.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-086.png)
- [Original lesson and curated constraints](lesson-brief.txt)
