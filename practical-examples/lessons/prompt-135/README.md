# Prompt 135: Deprecated API migration

Category: Node.js core · Purpose: Recognize and remove outdated runtime dependencies.
Create a small legacy fixture using deprecated Buffer construction and node:domain, then migrate it to appropriate current APIs. Use deprecation diagnostics and regression tests to verify the replacement behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 135
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual runtime reports legacy warnings or removal errors; modern code preserves the content without relying on deprecated APIs.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-135.png)
- [Original lesson and curated constraints](lesson-brief.txt)
