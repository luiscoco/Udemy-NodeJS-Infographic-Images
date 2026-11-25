# Prompt 114: Stack traces and source maps

Category: Tooling · Purpose: Relate transformed code failures to original source.
Bundle a small JavaScript program with esbuild and source maps. Trigger an error and compare stack traces with and without --enable-source-maps, verifying the mapped source location.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 114
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The generated bundle fails in both runs; source maps point the second stack back to the original source.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A source map relates generated code positions to original source positions. It improves stack traces after bundling without changing whether the application throws.

### Follow the implementation

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { build } from "esbuild";
import { assert, spawnNode } from "../../shared/lab.mjs";
await build({
  entryPoints: ["src/crash.mjs"],
  bundle: true,
  platform: "node",
  format: "esm",
  sourcemap: true,
  outfile: "dist/app.mjs",
});
const ordinary = await spawnNode(["dist/app.mjs"]),
  mapped = await spawnNode(["--enable-source-maps", "dist/app.mjs"]);
console.log("UNMAPPED", ordinary.stderr, "MAPPED", mapped.stderr);
assert.notEqual(ordinary.code, 0);
assert.notEqual(mapped.code, 0);
assert.ok(
  mapped.stderr.includes("src/crash.mjs") ||
    mapped.stderr.includes("src\\crash.mjs"),
);
```

### Why this produces the observed result

The same bundle runs with and without source-map support. Both executions fail, but the mapped stack points to the original crash source.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Move the throwing expression in the source, rebuild, and compare stacks. Explain why enabling source maps at runtime cannot repair a stale or missing generated map.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-114.png)
- [Original lesson and curated constraints](lesson-brief.txt)
