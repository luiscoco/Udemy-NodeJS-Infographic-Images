# Prompt 33: Dynamic imports and plugins

Category: Node.js core · Purpose: Load optional functionality only when needed.
Build a plugin loader using dynamic import and an explicit plugin-name allowlist. Verify lazy loading, a missing plugin, and rejection of a path-like unapproved plugin name.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 033
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The allowlisted plugin runs; arbitrary path input is rejected.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Dynamic import defers module loading until an operation needs it. The plugin registry maps a small set of public names to trusted import functions.

### Follow the implementation

From [demo.mjs, lines 1-10](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const plugins = new Map([["hello", () => import("./plugins/hello.mjs")]]);
async function load(name) {
  const factory = plugins.get(name);
  if (!factory) throw Error("Unknown plugin");
  return (await factory()).run();
}
console.log(await load("hello"));
await assert.rejects(load("../../secret"), /Unknown/);
console.log("unknown path rejected before import");
```

### Why this produces the observed result

Looking up a name before importing prevents arbitrary user text from becoming a filesystem specifier. An allowlisted name is a routing decision, not permission to execute untrusted plugin code.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a second plugin under a new registry key. Confirm it runs while an unknown or path-shaped key is still rejected before import.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-033.png)
- [Original lesson and curated constraints](lesson-brief.txt)
