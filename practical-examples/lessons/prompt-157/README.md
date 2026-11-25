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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A diagnostic report captures runtime and native-resource information around a checkpoint. getReport returns structured data, while writeReport writes an artifact for later investigation.

### Follow the implementation

From [demo.mjs, lines 1-10](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { mkdir } from "node:fs/promises";

await mkdir("./reports", { recursive: true });
process.report.directory = "./reports";
process.report.excludeEnv = true;

const data = process.report.getReport(new Error("Lab checkpoint"));
console.log(data.header.nodejsVersion);
console.log(Array.isArray(data.libuv));
console.log(process.report.writeReport());
```

### Why this produces the observed result

The application excludes environment variables and chooses a dedicated output directory. Reports can still contain operational details, so the example prints only selected fields and the generated filename.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Open a generated report locally and locate its header and libuv sections. Explain which debugging question each can answer without assuming the report is a CPU profile.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

process.report is stable. getReport returns an object; writeReport writes JSON with a generated timestamp/PID/sequence filename. Report generation may also log to stderr; show essential output only. Inspect javascriptStack, nativeStack, javascriptHeap and libuv. A report is a diagnostic snapshot, not a heap snapshot or proof of root cause. excludeEnv omits environment variables but does not make the remaining artifact public-safe: review paths, command arguments and other metadata before sharing. Windows lab uses programmatic capture; no POSIX signal commands. Complete the exercise: compare reports with and without an open timer/server and close all lab resources.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-157.png)
- [Original lesson and curated constraints](lesson-brief.txt)
