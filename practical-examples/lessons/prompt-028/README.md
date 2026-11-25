# Prompt 28: Async generators

Category: JavaScript · Purpose: Consume asynchronous sequences lazily.
Implement an async generator over a simulated paginated data source. Stop consumption early with for await...of and verify that later pages are not requested and cleanup runs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 028
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Only the first page is requested; breaking async iteration runs cleanup.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-028.png)
- [Original lesson and curated constraints](lesson-brief.txt)
