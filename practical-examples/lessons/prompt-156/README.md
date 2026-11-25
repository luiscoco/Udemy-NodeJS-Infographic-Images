# Prompt 156: Explicit Resource Management

Use using and await using to manage file handles and temporary directories. Verify resources are disposed in reverse declaration order on normal completion and on an exception; distinguish scope exit from process termination.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 156
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

hello
removed

## Walkthrough and experiments

using is JavaScript syntax; Node resources expose Symbol.dispose or Symbol.asyncDispose. await using awaits cleanup. The file closes before the temporary folder is removed (reverse declaration order). Normal block exit, return and thrown exceptions trigger disposal; abrupt process termination does not guarantee it. This sample requires no external package. Complete the exercise: throw inside the block and verify cleanup in a surrounding catch; compare with try/finally. Disposal errors can also propagate.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-156.png)
- [Original lesson and curated constraints](lesson-brief.txt)
