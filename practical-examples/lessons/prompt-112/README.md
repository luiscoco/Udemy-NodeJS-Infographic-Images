# Prompt 112: Linting and formatting

Category: Tooling · Purpose: Catch common mistakes and maintain consistent source formatting.
Configure eslint, @eslint/js, and prettier for an ESM project. Add check-only CI commands and verify they detect an unused variable, an undefined identifier, and a formatting violation.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 112
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

ESLint finds actual unused/undefined identifiers; Prettier distinguishes unformatted and formatted source.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-112.png)
- [Original lesson and curated constraints](lesson-brief.txt)
