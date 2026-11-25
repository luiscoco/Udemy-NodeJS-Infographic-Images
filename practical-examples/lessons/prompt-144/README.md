# Prompt 144: Single executable applications — experimental 1.1

Category: Node.js core · Purpose: Distribute a small application with its runtime.
Package a dependency-free CLI using the baseline’s built-in node --build-sea workflow. Document target-platform signing requirements and verify the executable runs without finding a separate Node.js executable on PATH.
The built-in generation workflow is available on this baseline; SEA remains in active development. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 144
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual single executable builds and runs with PATH emptied, demonstrating that the Node runtime is embedded.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-144.png)
- [Original lesson and curated constraints](lesson-brief.txt)
