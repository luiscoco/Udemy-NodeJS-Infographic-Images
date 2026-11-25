# Prompt 32: Package exports and imports

Category: Node.js core · Purpose: Define a deliberate public package interface.
Create a package using exports for public entry points and imports for internal aliases. Install its packed archive into a separate consumer and verify public imports succeed while an unexported subpath fails.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 032
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real tarball installs into a separate consumer: public import returns 42 and private subpath import fails.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-032.png)
- [Original lesson and curated constraints](lesson-brief.txt)
