# Prompt 31: ESM–CommonJS interoperability

Category: Node.js core · Purpose: Integrate packages using different module systems.
Create ESM and CommonJS consumers of a small library. Demonstrate createRequire and dynamic import, then test how top-level await affects synchronous loading from CommonJS.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 031
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both interop paths return 42; require rejects an ESM graph containing top-level await.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-031.png)
- [Original lesson and curated constraints](lesson-brief.txt)
