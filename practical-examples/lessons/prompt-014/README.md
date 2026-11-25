# Prompt 14: Unicode and regular expressions

Category: JavaScript · Purpose: Process real-world text without assuming one character equals one byte.
Build a Unicode-aware identifier validator and text-normalization example. Test accented characters, combining marks, and emoji; explain the distinction between code units, code points, and encoded bytes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 014
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Normalization equates canonical text; the emoji occupies 2 UTF-16 units, 1 code point, and 4 UTF-8 bytes.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-014.png)
- [Original lesson and curated constraints](lesson-brief.txt)
