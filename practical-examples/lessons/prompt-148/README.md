# Prompt 148: Virtual filesystem — experimental, Node.js 26.4+

Category: Node.js core · Purpose: Create self-contained filesystem fixtures.
Use node:vfs with the required experimental flag to build an in-memory fixture tree. Verify reads and writes, unmount cleanup, and a read-only configuration without treating the virtual filesystem as a security boundary.
The module was added in Node.js 26.4. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 148
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Mounted reads succeed, cleanup unmounts the fixture, and irreversible read-only mode rejects writes. VFS is not a sandbox.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-148.png)
- [Original lesson and curated constraints](lesson-brief.txt)
