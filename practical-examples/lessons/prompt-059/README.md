# Prompt 59: URLs and query parameters

Category: Node.js core · Purpose: Construct and interpret URLs correctly.
Build a URL utility using WHATWG URL and URLSearchParams. Test repeated parameters, encoded characters, relative URLs, and invalid input without manually concatenating query strings.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 059
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Repeated query values, percent encoding and relative resolution are shown without making a network request.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-059.png)
- [Original lesson and curated constraints](lesson-brief.txt)
