# Prompt 72: Worker pools

Category: Ecosystem · Purpose: Reuse workers and control CPU-work admission.
Use piscina to process CPU-heavy jobs with a fixed worker limit and bounded queue. Overload the pool and verify excess work is rejected or delayed according to an explicit policy.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 072
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A bounded two-thread pool computes a result and rejects excess queued work.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-072.png)
- [Original lesson and curated constraints](lesson-brief.txt)
