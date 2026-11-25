# Prompt 77: Express middleware

Category: Ecosystem · Purpose: Understand a common request-processing abstraction.
Build a minimal express application with request logging, routing, and error middleware. Record execution order and verify an error reaches the error handler without sending two responses.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 077
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Express 5 forwards rejected route promises to the four-argument error middleware; unknown routes remain 404.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-077.png)
- [Original lesson and curated constraints](lesson-brief.txt)
