# Prompt 146: Module customization hooks — experimental 1.2

Category: Node.js core · Purpose: Explore custom module resolution.
Implement a narrow module alias using module.registerHooks. Verify normal resolution still works, missing aliases fail clearly, and the hook avoids the deprecated module.register API.
The synchronous hook API is currently classified as a release candidate. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 146
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The preload hook resolves only explicit aliases, preserves node: imports and rejects an unknown alias.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-146.png)
- [Original lesson and curated constraints](lesson-brief.txt)
