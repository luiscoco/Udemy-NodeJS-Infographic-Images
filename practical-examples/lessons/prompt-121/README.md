# Prompt 121: CPU profiling

Category: Node.js core · Purpose: Locate expensive execution before optimizing it.
Profile a CPU-heavy endpoint using --cpu-prof and inspect the generated profile. Optimize the dominant function and compare correctness and timing over repeated runs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 121
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real CPU profile is generated under this lesson’s profiles directory and can be opened in DevTools.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-121.png)
- [Original lesson and curated constraints](lesson-brief.txt)
