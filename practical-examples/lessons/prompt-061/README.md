# Prompt 61: HTTP clients and connection reuse

Category: Node.js core · Purpose: Understand socket reuse and client resource ownership.
Build a node:http client using an explicitly configured Agent. Measure connection reuse across requests, enforce a socket limit, and verify the Agent is closed after the workload.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 061
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The first connection is new; subsequent reuse is measured, not assumed. The owned Agent is destroyed.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-061.png)
- [Original lesson and curated constraints](lesson-brief.txt)
