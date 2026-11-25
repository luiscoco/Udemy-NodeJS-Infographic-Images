# Prompt 107: Asynchronous tests and teardown

Category: Node.js core · Purpose: Make asynchronous tests complete and clean up reliably.
Write tests around a temporary HTTP server and directory using test lifecycle hooks. Verify rejected promises fail the test and teardown closes resources even when an assertion fails.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 107
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real HTTP fixture uses an OS-assigned port; test cleanup closes it even when assertions fail.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-107.png)
- [Original lesson and curated constraints](lesson-brief.txt)
