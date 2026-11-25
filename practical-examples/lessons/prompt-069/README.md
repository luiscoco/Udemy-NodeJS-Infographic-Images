# Prompt 69: Child processes without shell interpolation

Category: Node.js core · Purpose: Run external programs with controlled arguments and resources.
Launch a helper using spawn or execFile with an argument array. Capture output, handle spawn failure and timeout, and verify an argument containing shell metacharacters remains ordinary data.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 069
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Shell-looking input is printed literally by a child process using an argument array, never interpolated.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-069.png)
- [Original lesson and curated constraints](lesson-brief.txt)
