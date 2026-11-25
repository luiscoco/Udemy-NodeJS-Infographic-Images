# Prompt 30: CommonJS

Category: Node.js core · Purpose: Understand existing Node.js packages and applications.
Build a small .cjs application using require and module.exports. Demonstrate module caching with a stateful export and verify how repeated imports share that state.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 030
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Resolved CommonJS module instances are cached; the two calls share the same counter.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

CommonJS evaluates a resolved module once and caches its exported object. Requiring the same resolved file twice returns the same instance and therefore shares module-level state.

### Follow the implementation

From [demo.mjs, lines 1-7](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const a = require("./state.cjs"),
  b = require("./state.cjs");
console.log(a === b, a.next(), b.next());
assert.equal(a, b);
```

### Why this produces the observed result

`createRequire(import.meta.url)` provides CommonJS loading from this ES module. The equality assertion and increasing counter reveal both object identity and shared state.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Call `next()` through each reference again. Predict the sequence and explain why separate Node processes would each start with a fresh module cache.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-030.png)
- [Original lesson and curated constraints](lesson-brief.txt)
