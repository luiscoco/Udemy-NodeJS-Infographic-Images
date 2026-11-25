# Prompt 58: Streaming compression

Category: Node.js core · Purpose: Reduce data size without buffering entire files.
Build streaming gzip and Brotli round trips using node:zlib. Verify restored checksums, handle corrupted input, and enforce a decompressed-output limit.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 058
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both codecs round-trip actual bytes and reject an output budget smaller than the fixture. Sizes are measured.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-058.png)
- [Original lesson and curated constraints](lesson-brief.txt)

The practical application streams both gzip and Brotli file pipelines, verifies SHA-256, enforces a cumulative decompressed-byte limit, and preserves the previous target when an oversized restore fails.
