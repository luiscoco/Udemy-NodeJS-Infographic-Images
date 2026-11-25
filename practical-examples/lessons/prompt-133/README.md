# Prompt 133: Module compile caching

Category: Node.js core · Purpose: Evaluate startup optimization with evidence.
Enable the stable module compile cache for a CLI with several modules. Compare cold and repeated startup, report cache status, and verify the application still works when caching is unavailable.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 133
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Cache status and full-process startup times are measured. Caching does not cache exported business results or guarantee a speedup.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-133.png)
- [Original lesson and curated constraints](lesson-brief.txt)
