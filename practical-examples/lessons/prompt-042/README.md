# Prompt 42: Packaging and publishing preparation

Category: Tooling · Purpose: Verify what consumers will actually receive.
Prepare a library with a files allowlist, README, license, and release metadata. Inspect npm pack --dry-run and npm publish --dry-run, install the resulting archive into a consumer, and verify secrets and development fixtures are excluded.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 042
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The npm pack dry run includes the distributable entry and excludes the secret-shaped fixture. No package is published.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-042.png)
- [Original lesson and curated constraints](lesson-brief.txt)
