# Prompt 16: Blocking versus nonblocking execution

Category: Node.js core · Purpose: Understand why a responsive server can become blocked.
Build a server with one delayed-I/O endpoint and one CPU-heavy endpoint. Send overlapping requests and measure responsiveness; demonstrate why adding async to CPU-heavy code does not make that work parallel.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 016
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Concurrent I/O waits overlap; synchronous CPU work serializes the server. Printed durations are measurements, not fixed timing promises.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-016.png)
- [Original lesson and curated constraints](lesson-brief.txt)
