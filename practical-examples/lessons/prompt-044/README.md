# Prompt 44: Paths and containment

Category: Node.js core · Purpose: Keep file access within an intended directory.
Implement a file resolver using node:path and appropriate real-path checks inside a controlled fixture directory. Test traversal, absolute paths, and symlinks; document remaining race-condition limitations.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 044
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Existing-file resolution permits the fixture and rejects traversal, absolute input and missing files.

## Walkthrough and experiments

realpath resolves symlinks, but check/open remains a TOCTOU race on a hostile filesystem. This is not a general sandbox.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-044.png)
- [Original lesson and curated constraints](lesson-brief.txt)
