# Prompt 91: Redis caching

Category: Ecosystem · Purpose: Reduce repeated work while managing stale data.
Implement cache-aside reads using the redis package and a local Redis service. Add TTLs and write invalidation, then verify cache misses, stale-entry removal, and a defined cache-outage fallback.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 091
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Miss loads DB, hit avoids it, commit-plus-invalidation refreshes it, and a closed cache falls back to PostgreSQL.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-091.png)
- [Original lesson and curated constraints](lesson-brief.txt)
