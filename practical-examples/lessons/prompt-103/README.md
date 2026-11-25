# Prompt 103: Outbound-request restrictions

Category: Node.js core · Purpose: Prevent user input from choosing unintended network destinations.
Build a download service whose destination comes from a fixed server-side allowlist rather than an arbitrary user URL. Disable or revalidate redirects and verify attempts to reach unapproved destinations fail.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 103
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A server-owned destination map, redirect rejection and body cap are tested against a real loopback fixture.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-103.png)
- [Original lesson and curated constraints](lesson-brief.txt)
