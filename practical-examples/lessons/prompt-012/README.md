# Prompt 12: Iterators and generators

Category: JavaScript · Purpose: Produce values lazily instead of allocating entire datasets.
Implement a custom iterable and a generator that yields a large numeric range. Consume only the first ten values and verify that the remaining values were never generated.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 012
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Only ten values are produced; breaking the loop executes generator cleanup.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-012.png)
- [Original lesson and curated constraints](lesson-brief.txt)
