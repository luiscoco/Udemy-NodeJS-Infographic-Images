# Prompt 4: Environment configuration

Category: Node.js core · Purpose: Separate configuration from application logic.
Build a configuration loader using process.env and node --env-file. Validate a port, boolean, and required secret; verify environment-variable precedence and fail before startup when configuration is invalid.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 004
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Valid configuration prints public fields. Invalid ports fail without exposing the fixture secret.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-004.png)
- [Original lesson and curated constraints](lesson-brief.txt)
