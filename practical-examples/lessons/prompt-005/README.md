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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A CLI has a contract with both humans and programs: parse declared options, put successful machine-readable results on stdout, put diagnostics on stderr, and return a nonzero exit code on failure.

### Follow the implementation

From [cli.mjs, lines 1-14](cli.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { parseArgs } from "node:util";
try {
  const { values } = parseArgs({
    options: { input: { type: "string" }, help: { type: "boolean" } },
  });
  if (values.help) console.log("Usage: --input NAME");
  else {
    if (!values.input) throw Error("Missing input");
    console.log(JSON.stringify({ input: values.input }));
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
```

### Why this produces the observed result

`parseArgs` rejects unknown options. Setting `process.exitCode` records failure while allowing pending output and normal cleanup to finish; it avoids forcing immediate termination.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Pass an unknown option and capture stdout and stderr separately. Verify that the diagnostic does not become part of a JSON result consumed by another program.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-005.png)
- [Original lesson and curated constraints](lesson-brief.txt)
