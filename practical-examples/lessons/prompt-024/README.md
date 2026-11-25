# Prompt 24: Sequential and concurrent await

Category: JavaScript · Purpose: Express dependencies without accidentally serializing independent work.
Implement a workflow containing two independent operations and one dependent operation. Compare unnecessary sequential awaits with correct concurrency, verifying both result correctness and elapsed time.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 024
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both workflows produce 5; independent waits overlap in the concurrent version. Timings are measured.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-024.png)
- [Original lesson and curated constraints](lesson-brief.txt)
