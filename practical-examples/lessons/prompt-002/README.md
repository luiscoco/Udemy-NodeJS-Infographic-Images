# Prompt 2: CLI and REPL

Category: Node.js core · Purpose: Explore runtime behavior without building an application.
Create a short CLI and REPL lab covering script execution, --eval, --print, --check, and process.versions. Include a syntax error and show the expected command output and exit status.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 002
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

eval has no result output; print writes 5; main prints a greeting; the intentionally invalid fixture fails parsing.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Node's CLI can execute an expression, print its result, check syntax, or run a file. `--eval` evaluates code without automatically printing the expression value; `--print` evaluates and prints it.

### Follow the implementation

From [demo.mjs, lines 1-12](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [
  ["--eval", "2 + 3"],
  ["--print", "2 + 3"],
  ["--check", "main.mjs"],
  ["main.mjs"],
  ["--check", "bad.mjs"],
]) {
  const r = await spawnNode(args);
  console.log({ args, ...r });
  assert.equal(r.code, args.includes("bad.mjs") ? 1 : 0);
}
```

### Why this produces the observed result

The harness launches each command in a fresh process and checks its exit status. The invalid file is an intentional parser failure: `--check` discovers it without running application logic.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change `2 + 3` to `2 * 3` in both argument arrays. Predict which command prints `6` and which remains silent before running the demo.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-002.png)
- [Original lesson and curated constraints](lesson-brief.txt)
