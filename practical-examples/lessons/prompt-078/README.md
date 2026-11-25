# Prompt 78: Request and response validation

Category: Ecosystem · Purpose: Enforce an API contract at its boundaries.
Add trusted JSON Schemas to a fastify endpoint for parameters, body, and response. Verify invalid requests fail and internal fields do not appear in serialized responses.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 078
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Invalid input yields 400, while the response schema strips an internal field from the successful 201 response.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-078.png)
- [Original lesson and curated constraints](lesson-brief.txt)
