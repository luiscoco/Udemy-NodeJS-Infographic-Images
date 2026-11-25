# Prompt 90: MongoDB document modeling

Category: Ecosystem · Purpose: Work with a document-oriented persistence model.
Build a product catalog using the mongodb driver and a local MongoDB service. Add a useful index, validate document boundaries, and verify the query plan and duplicate-key behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 090
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A unique SKU index supports an idempotent upsert; a duplicate insert is rejected and the real query plan is displayed.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **mongodb**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-090.png)
- [Original lesson and curated constraints](lesson-brief.txt)
