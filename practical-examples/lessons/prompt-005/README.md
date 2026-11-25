# Prompt 5: Command-line arguments and output contracts

Category: Node.js core · Purpose: Build commands usable by people and scripts.
Build a CLI using node:util.parseArgs with --input, --format, and --help. Send results to stdout and diagnostics to stderr; verify invalid arguments produce a nonzero exit code without corrupting JSON output.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 005
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Valid input is JSON on stdout; an invalid flag produces stderr and a nonzero exit.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-005.png)
- [Original lesson and curated constraints](lesson-brief.txt)
