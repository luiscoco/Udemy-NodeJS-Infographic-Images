# Prompt 149: Built-in benchmark runner — experimental 1.0, Node.js 26.9+

Category: Node.js core · Purpose: Explore structured runtime benchmarking.
Use node:bench with its required experimental flag to compare two equivalent implementations. Include warmup and repeated measurements, verify equal outputs, and report variability instead of declaring a winner from one sample.
The benchmark runner was added in Node.js 26.9 and is in early development. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 149
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual experimental benchmark runner measures two equivalent string operations. Results depend on runtime and hardware.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-149.png)
- [Original lesson and curated constraints](lesson-brief.txt)
