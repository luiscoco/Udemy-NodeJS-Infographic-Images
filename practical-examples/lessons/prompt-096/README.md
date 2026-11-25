# Prompt 96: Secrets and configuration hygiene

Category: Node.js core · Purpose: Keep credentials out of source and accidental output.
Build startup configuration that reads secrets from environment variables or a mounted file. Validate missing values and verify sanitized diagnostics never reveal the secret or its source file contents.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 096
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A mounted-file fixture configures the app; missing configuration fails generically and never prints the secret.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-096.png)
- [Original lesson and curated constraints](lesson-brief.txt)
