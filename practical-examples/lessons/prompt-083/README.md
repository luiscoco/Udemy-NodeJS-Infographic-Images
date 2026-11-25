# Prompt 83: Server-sent events

Category: Node.js core · Purpose: Push server updates to browser clients.
Build an SSE endpoint with node:http and a browser client. Include event IDs, heartbeats, and bounded retained history; verify reconnection and an explicit response when requested history has expired.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 083
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Reconnection replays only events after Last-Event-ID; disconnect clears heartbeat state.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-083.png)
- [Original lesson and curated constraints](lesson-brief.txt)
