# Prompt 151: Command-Line File-Processing Tool

Category: Node.js corePurpose: Consolidate CLI design, filesystem safety, and streaming.
Learning goals: Argument parsing, stdin/stdout, UTF-8 decoding, transformations, backpressure, cancellation, exit codes, and tests.
Implementation prompt:
Build logtool, a dependency-free Node.js CLI that filters newline-delimited JSON logs and produces aggregate statistics. Support files and stdin, streamed output, configurable malformed-record handling, cancellation, and safe output replacement. Provide generated fixtures and tests demonstrating correctness and bounded memory.
Acceptance criteria:
Processes a generated 1 GiB input with correct counts and a documented memory budget substantially below input size.
Handles empty input, split UTF-8 sequences, malformed records, and an incomplete final line.
Enforces a maximum record length.
Produces clean machine-readable stdout and appropriate stderr diagnostics.
Returns meaningful exit codes and removes incomplete output after cancellation.
Suggested point: After Module 8.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 151
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The complete streaming CLI filters records, counts malformed data, handles a final line without newline, and atomically preserves an existing output on failure.

## Walkthrough and experiments

Run node applications/logtool/main.mjs --input FILE --output RESULT --level info --malformed count from the workspace. Use create-fixture.mjs for an optional 1 GiB benchmark; record peak RSS and select a documented memory budget rather than assuming one.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-151.png)
- [Original lesson and curated constraints](lesson-brief.txt)
