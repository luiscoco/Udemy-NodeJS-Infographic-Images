# Prompt 124: Resource budgets

Category: Node.js core · Purpose: Keep overload from causing uncontrolled memory growth.
Build a service with explicit limits for concurrent work, queued work, and payload size. Apply a documented heap limit, overload the service, and verify predictable rejection while tracking heap and total process memory separately.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 124
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Exactly eight slots run concurrently, 32 wait, and the next submission is rejected. All accepted work drains.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-124.png)
- [Original lesson and curated constraints](lesson-brief.txt)
