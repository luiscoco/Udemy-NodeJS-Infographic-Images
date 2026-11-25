# Prompt 55: Pipelines and failure cleanup

Category: Node.js core · Purpose: Coordinate stream completion and errors.
Build a file transformation with node:stream/promises.pipeline. Inject a transform error and an abort signal, verifying all streams close and incomplete output is handled according to a stated policy.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 055
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Pipeline failure destroys participants and removes partial output; an incomplete result is never published.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-055.png)
- [Original lesson and curated constraints](lesson-brief.txt)
