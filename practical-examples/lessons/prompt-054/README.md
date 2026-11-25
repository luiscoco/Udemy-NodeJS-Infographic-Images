# Prompt 54: Transform streams

Category: Node.js core · Purpose: Transform data incrementally.
Build a Transform stream that converts newline-delimited JSON into filtered output. Handle records split across chunks, impose a maximum record length, and verify malformed-record behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 054
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Byte-by-byte input preserves UTF-8, filters records, and flushes the final line without a newline.

## Walkthrough and experiments

The full Transform is supplied in shared/ndjson.mjs, including _flush. Its length budget is UTF-16 code units; byte-level input budgets are separate.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-054.png)
- [Original lesson and curated constraints](lesson-brief.txt)
