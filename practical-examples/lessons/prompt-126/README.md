# Prompt 126: Circuit breakers and recovery

Category: JavaScript · Purpose: Reduce repeated work against a failing dependency.
Implement a small circuit breaker around an injected asynchronous dependency. Test closed, open, and half-open transitions deterministically, including recovery and limits on probe requests.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 126
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Three failures open the breaker; an open call never reaches the dependency, and a later successful probe closes it.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-126.png)
- [Original lesson and curated constraints](lesson-brief.txt)
