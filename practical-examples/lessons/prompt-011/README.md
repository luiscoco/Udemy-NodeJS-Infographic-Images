# Prompt 11: Collections and identity

Category: JavaScript · Purpose: Select collections according to lookup and ownership needs.
Build a deduplication example using Set, an ID lookup using Map, and object metadata using WeakMap. Verify equality behavior and explain which collections support enumeration and predictable retention.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 011
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Set removes repeated primitives; distinct objects remain distinct; WeakMap stores non-enumerable object metadata.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-011.png)
- [Original lesson and curated constraints](lesson-brief.txt)
