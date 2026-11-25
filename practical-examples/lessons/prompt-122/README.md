# Prompt 122: Memory leaks and heap analysis

Category: Node.js core · Purpose: Distinguish retained objects from normal allocation activity.
Create a controlled leak caused by a growing cache or retained listener. Compare memory measurements and heap evidence before and after fixing ownership, avoiding claims based on one memory sample.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 122
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The unbounded cache retains 80000 entries while the bounded cache retains 1000; heap usage is measured rather than assumed.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-122.png)
- [Original lesson and curated constraints](lesson-brief.txt)
