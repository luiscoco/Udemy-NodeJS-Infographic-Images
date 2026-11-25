# Prompt 37: Portable npm scripts

Category: Tooling · Purpose: Make common development commands consistent.
Add npm scripts for checking, testing, running, and cleaning a project. Use Node.js scripts for filesystem operations instead of shell-specific commands, and verify equivalent behavior on Windows and POSIX shells.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 037
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A portable Node cleanup removes only a generated, project-owned directory.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-037.png)
- [Original lesson and curated constraints](lesson-brief.txt)
