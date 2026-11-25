# Prompt 81: Streaming file uploads

Category: Ecosystem · Purpose: Accept uploads without unbounded buffering or unsafe filenames.
Build an upload endpoint using fastify and @fastify/multipart. Generate storage names, limit file sizes and part counts, and verify oversized or interrupted uploads remove partial files.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 081
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real multipart client uploads a small file; an oversized stream yields 413 and removes its partial output.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-081.png)
- [Original lesson and curated constraints](lesson-brief.txt)
