# Prompt 49: Text encodings and chunk boundaries

Category: Node.js core · Purpose: Decode streamed text without corrupting characters.
Split UTF-8 text containing emoji into arbitrary byte chunks and decode it with StringDecoder. Compare naive decoding and verify the correct output for every possible split point.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 049
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Every possible two-chunk split preserves the Unicode text; incomplete bytes are buffered until decoder end.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-049.png)
- [Original lesson and curated constraints](lesson-brief.txt)
