# Prompt 29: ES modules

Category: Node.js core · Purpose: Structure applications with explicit module boundaries.
Create an ESM application using "type": "module", named exports, and explicit relative extensions. Introduce a missing-extension error and verify the corrected module graph runs successfully.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 029
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

ESM imports with explicit extensions work; Node rejects the extensionless fixture.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An ES module declares its dependencies with import syntax. In this Node file-based example, the relative specifier includes the actual file extension.

### Follow the implementation

From [demo.mjs, lines 1-6](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { add } from "./math.js";
import assert from "node:assert/strict";
console.log(add(2, 3));
assert.equal(add(2, 3), 5);
await assert.rejects(import("./math"), { code: "ERR_MODULE_NOT_FOUND" });
console.log("extensionless import rejected");
```

### Why this produces the observed result

The successful import and intentionally rejected extensionless import demonstrate Node's resolver rather than a bundler's more permissive resolution rules.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Rename the math file and update only one import. Observe the resolver failure and explain why exporting a function cannot compensate for an incorrect module specifier.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-029.png)
- [Original lesson and curated constraints](lesson-brief.txt)
