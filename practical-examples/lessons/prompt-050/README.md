# Prompt 50: File watching

Category: Node.js core · Purpose: React to changes while accommodating imperfect notifications.
Build a directory watcher with debouncing and periodic reconciliation. Test rapid edits, replacement, and deletion, treating notifications as hints rather than assuming one event per change.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 050
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Reconciliation serializes scans and reaches the real directory state despite coalesced watcher hints.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-050.png)
- [Original lesson and curated constraints](lesson-brief.txt)
