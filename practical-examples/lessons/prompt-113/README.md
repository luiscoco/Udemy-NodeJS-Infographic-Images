# Prompt 113: Interactive debugging

Category: Node.js core · Purpose: Inspect program state before guessing at a fix.
Create a reproducible calculation bug and debug it with --inspect-brk using an editor or DevTools. Set a conditional breakpoint, inspect variables, and verify a regression test fails before the fix.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 113
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The regression test fails on -1900 from the buggy formula and passes on 80 after the fix.

## Walkthrough and experiments

For a breakpoint demonstration run node --inspect-brk broken.mjs, attach DevTools locally, and inspect price=100 and percent=20.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-113.png)
- [Original lesson and curated constraints](lesson-brief.txt)
