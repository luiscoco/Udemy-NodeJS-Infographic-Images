# Prompt 64: HTTP/2 multiplexing

Category: Node.js core · Purpose: Understand concurrent streams within a connection.
Build an HTTP/2 server and client using node:http2. Send multiple requests over one session, cancel one stream, and verify the remaining streams complete and the session closes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 064
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two HTTP/2 streams share a session; cancelling one does not cancel the other. Cleartext is for this loopback lab only.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-064.png)
- [Original lesson and curated constraints](lesson-brief.txt)
