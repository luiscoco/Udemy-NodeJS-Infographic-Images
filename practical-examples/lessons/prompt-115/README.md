# Prompt 115: Structured logging

Category: Ecosystem · Purpose: Produce logs that support filtering and diagnosis.
Add pino logging to a small API with structured errors and request identifiers. Configure redaction and verify credentials and sensitive fields are absent from captured logs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 115
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real JSON logs preserve the correlation ID and structured error while removing configured sensitive fields.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-115.png)
- [Original lesson and curated constraints](lesson-brief.txt)
