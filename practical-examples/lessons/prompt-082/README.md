# Prompt 82: WebSocket communication

Category: Ecosystem · Purpose: Support bidirectional communication over persistent connections.
Build a WebSocket server using ws and a native WebSocket client. Add message validation, heartbeat cleanup, and a bounded outbound-buffer policy; verify disconnected and slow clients are handled.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 082
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A native WebSocket client exchanges validated JSON with the external ws server; heartbeat and listener resources are cleaned up.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-082.png)
- [Original lesson and curated constraints](lesson-brief.txt)
