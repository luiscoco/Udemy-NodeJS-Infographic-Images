# Prompt 105: Runtime permissions

Category: Node.js core · Purpose: Reduce the capabilities available to a trusted application.
Run a file-processing CLI under --permission with only the required filesystem access. Verify permitted operations succeed and denied file, network, and child-process operations fail; document why this is not a malicious-code sandbox.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 105
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Granted read/write work; a read outside the grant fails. The permission model is not a malicious-code sandbox.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-105.png)
- [Original lesson and curated constraints](lesson-brief.txt)
