# Prompt 43: Filesystem operations

Category: Node.js core · Purpose: Read and write files with predictable failure handling.
Build a file utility with node:fs/promises that creates, reads, appends, and deletes a temporary file. Verify missing-file errors and ensure explicitly opened file handles close after both success and failure.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 043
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The temporary file is created, appended, read through an owned handle, and removed.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-043.png)
- [Original lesson and curated constraints](lesson-brief.txt)
