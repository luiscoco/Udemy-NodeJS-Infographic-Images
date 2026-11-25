# Prompt 157: Diagnostic Reports

Capture a diagnostic report for a controlled Node.js process. Locate runtime metadata, JavaScript and native stacks, heap statistics and libuv handles. Omit environment variables and explain how to handle the resulting diagnostic artifact.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 157
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

v26.13.1
true
<generated report filename>

## Walkthrough and experiments

process.report is stable. getReport returns an object; writeReport writes JSON with a generated timestamp/PID/sequence filename. Report generation may also log to stderr; show essential output only. Inspect javascriptStack, nativeStack, javascriptHeap and libuv. A report is a diagnostic snapshot, not a heap snapshot or proof of root cause. excludeEnv omits environment variables but does not make the remaining artifact public-safe: review paths, command arguments and other metadata before sharing. Windows lab uses programmatic capture; no POSIX signal commands. Complete the exercise: compare reports with and without an open timer/server and close all lab resources.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-157.png)
- [Original lesson and curated constraints](lesson-brief.txt)
