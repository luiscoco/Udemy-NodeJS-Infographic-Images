# Prompt 73: Message channels and transferable data

Category: Node.js core · Purpose: Understand the cost and ownership of cross-thread communication.
Compare cloning an ArrayBuffer with transferring it through a MessageChannel. Verify sender-side detachment after transfer and measure the difference using a documented payload size.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 073
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Transfer detaches the sender ArrayBuffer while the receiver owns the original-sized storage.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-073.png)
- [Original lesson and curated constraints](lesson-brief.txt)
