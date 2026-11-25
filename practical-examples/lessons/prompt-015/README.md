# Prompt 15: Dates, locales, and time zones

Category: JavaScript · Purpose: Present time and numeric values consistently across locales.
Format the same timestamp and currency amount using Intl for Spain and the United States. Specify time zones explicitly and verify examples around a daylight-saving transition without relying on the machine’s default locale.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 015
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Madrid jumps from 01:30 to 03:30. Currency formatting depends on locale/ICU; it does not convert currency.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-015.png)
- [Original lesson and curated constraints](lesson-brief.txt)
