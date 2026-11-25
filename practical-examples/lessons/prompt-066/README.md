# Prompt 66: UDP datagrams

Category: Node.js core · Purpose: Understand message-oriented communication without reliable delivery guarantees.
Build a UDP sender and receiver using node:dgram with sequence numbers. Simulate dropped and reordered messages, report missing sequences, and verify sockets close cleanly.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 066
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The receiver logs actual datagrams and computes missing sequence 4 at the application layer. UDP itself does not promise delivery/order.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-066.png)
- [Original lesson and curated constraints](lesson-brief.txt)
