# Prompt 45: Directory traversal

Category: Node.js core · Purpose: Inspect directory trees without loading everything at once.
Build an asynchronous directory walker using opendir and file metadata. Define a symlink policy, handle inaccessible entries, and verify it avoids cycles and reports correct file counts.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 045
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A lazy recursive walker finds two real fixtures and avoids following symbolic links.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-045.png)
- [Original lesson and curated constraints](lesson-brief.txt)
