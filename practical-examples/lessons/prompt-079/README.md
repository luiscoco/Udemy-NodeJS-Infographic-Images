# Prompt 79: REST pagination and filtering

Category: Ecosystem · Purpose: Design predictable collection endpoints.
Build a paginated collection endpoint with fastify, stable sorting, and bounded page size. Verify traversal has no duplicates for a fixed dataset and invalid cursors receive a defined error.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 079
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Cursor traversal returns each fixture ID exactly once and rejects unbounded limits.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-079.png)
- [Original lesson and curated constraints](lesson-brief.txt)
