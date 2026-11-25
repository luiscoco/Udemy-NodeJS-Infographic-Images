# Prompt 48: Buffers and binary layouts

Category: Node.js core · Purpose: Encode and decode binary protocols.
Define a binary record containing a version byte, integer length, and payload using Buffer and typed arrays. Verify endianness, bounds checking, and round-trip decoding of multiple records.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 048
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A versioned big-endian binary packet round-trips; malformed/truncated frames are rejected.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-048.png)
- [Original lesson and curated constraints](lesson-brief.txt)
