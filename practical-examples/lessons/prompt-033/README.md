# Prompt 33: Dynamic imports and plugins

Category: Node.js core · Purpose: Load optional functionality only when needed.
Build a plugin loader using dynamic import and an explicit plugin-name allowlist. Verify lazy loading, a missing plugin, and rejection of a path-like unapproved plugin name.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 033
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The allowlisted plugin runs; arbitrary path input is rejected.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-033.png)
- [Original lesson and curated constraints](lesson-brief.txt)
