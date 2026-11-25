# Prompt 25: Bounded concurrency

Category: JavaScript · Purpose: Prevent large workloads from overwhelming resources.
Implement an asynchronous task runner with a configurable concurrency limit and no external package. Process twenty tasks, inject failures, and assert that active work never exceeds the configured limit.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 025
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Twenty tasks preserve result order with at most three active; one failure does not stop the remaining work.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-025.png)
- [Original lesson and curated constraints](lesson-brief.txt)
