# Prompt 47: File permissions and exclusive creation

Category: Node.js core · Purpose: Control access and prevent accidental overwrites.
Create a private temporary file using appropriate modes and exclusive creation flags. Verify a second creation attempt fails and explain which permission expectations differ on Windows.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 047
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Exclusive creation rejects an overwrite. Mode 0600 has POSIX semantics; Windows privacy requires ACL consideration.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-047.png)
- [Original lesson and curated constraints](lesson-brief.txt)
