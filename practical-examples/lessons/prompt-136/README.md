# Prompt 136: Container packaging

Category: Tooling · Purpose: Deliver a reproducible application environment.
Containerize a Node.js API using Docker with an explicitly pinned runtime, npm ci, a non-root user, and a minimal runtime stage. Verify startup, signal delivery, and exclusion of source secrets and unnecessary development dependencies.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 136
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The complete two-stage Docker image builds, serves a real request as USER node, and the owned container stops.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **docker**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-136.png)
- [Original lesson and curated constraints](lesson-brief.txt)
