# Prompt 130: Type checking JavaScript with JSDoc

Category: Tooling · Purpose: Gain static feedback without changing the implementation language.
Add JSDoc types to an existing JavaScript module and check it with typescript using checkJs and no emit. Introduce an incorrect argument type and verify the checker catches it while Node still runs ordinary JavaScript.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 130
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

JavaScript permits string concatenation at runtime; JSDoc checking detects the bad argument and accepts the fixed call.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-130.png)
- [Original lesson and curated constraints](lesson-brief.txt)
