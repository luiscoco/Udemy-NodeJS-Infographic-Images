# Prompt 36: Package metadata and dependency types

Category: Tooling · Purpose: Declare how a package should be installed and consumed.
Create a package manifest demonstrating dependencies, development dependencies, peer dependencies, optional dependencies, and an engine requirement. Use tiny local fixture packages and verify which relationships appear in the installed dependency tree.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 036
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The manifest separates dependency responsibilities and the optional feature has an actual fallback.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Package metadata distinguishes runtime dependencies, development tools, consumer-provided peers, and optional capabilities. These declarations describe different installation responsibilities.

### Follow the implementation

From [demo.mjs, lines 1-22](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const manifest = JSON.parse(
  await readFile(new URL("./fixture-package.json", import.meta.url)),
);
for (const kind of [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
])
  console.log(kind, manifest[kind]);
try {
  await import("course-not-installed-optional-fixture");
} catch (e) {
  assert.equal(e.code, "ERR_MODULE_NOT_FOUND");
  console.log("optional feature unavailable; baseline app continues");
}
console.log(
  "engines declares compatibility, not runtime installation:",
  manifest.engines,
);
```

### Why this produces the observed result

The missing optional import has an explicit fallback so the baseline application still runs. An engines declaration communicates compatibility; it does not install or activate a Node version.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Identify one real dependency of this workspace in each applicable category. Explain which functionality should remain available if an optional integration cannot load.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-036.png)
- [Original lesson and curated constraints](lesson-brief.txt)
