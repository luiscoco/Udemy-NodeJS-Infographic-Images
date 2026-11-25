# Prompt 31: ESM–CommonJS interoperability

Category: Node.js core · Purpose: Integrate packages using different module systems.
Create ESM and CommonJS consumers of a small library. Demonstrate createRequire and dynamic import, then test how top-level await affects synchronous loading from CommonJS.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 031
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both interop paths return 42; require rejects an ESM graph containing top-level await.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

ES modules can consume CommonJS through an appropriate loading bridge, and dynamic import can await an asynchronous ES module graph.

### Follow the implementation

From [demo.mjs, lines 1-10](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
console.log(require("./helper.cjs").answer);
const esm = await import("./helper.mjs");
console.log(esm.answer);
assert.throws(() => require("./helper.mjs"), {
  code: "ERR_REQUIRE_ASYNC_MODULE",
});
console.log("async ESM requires dynamic import");
```

### Why this produces the observed result

The supplied ESM helper contains top-level await. Requiring that graph synchronously fails with ERR_REQUIRE_ASYNC_MODULE; the distinction concerns asynchronous evaluation, not simply the `.mjs` extension.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare the dynamic import with the require call for the same helper. Explain why returning a promise from dynamic import solves a requirement that synchronous require cannot satisfy here.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-031.png)
- [Original lesson and curated constraints](lesson-brief.txt)
