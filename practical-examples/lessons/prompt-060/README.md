# Prompt 60: Core HTTP server

Category: Node.js core · Purpose: Understand the request-response foundation beneath frameworks.
Build a node:http JSON server with two routes, explicit status codes, body-size limits, and request timeouts. Verify unknown routes, malformed JSON, and oversized requests.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 060
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real HTTP API is exercised through success, missing route, malformed JSON and body-limit cases.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-060.png)
- [Original lesson and curated constraints](lesson-brief.txt)
