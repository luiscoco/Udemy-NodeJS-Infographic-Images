# Prompt 13: Serialization and numeric boundaries

Category: JavaScript · Purpose: Preserve meaning when data crosses JSON boundaries.
Create a serializer for records containing dates and large integer identifiers. Demonstrate BigInt, unsafe integer precision, and cyclic-object failures, then verify a documented JSON representation round-trips correctly.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 013
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A decimal string preserves an integer beyond Number.MAX_SAFE_INTEGER; dates need explicit reconstruction.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-013.png)
- [Original lesson and curated constraints](lesson-brief.txt)
