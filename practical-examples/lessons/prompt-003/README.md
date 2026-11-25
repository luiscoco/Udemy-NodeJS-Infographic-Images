# Prompt 3: Minimal project structure

Category: Tooling · Purpose: Establish a small, understandable project foundation.
Create an ES-module project with src, test, a README, and npm scripts for running and testing. Include one exported function and an assertion that can run from a clean checkout.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 003
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The application prints 5 and its addition test passes.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Separating application source from tests gives each file a clear job. The source exports a reusable addition function, and the test imports that function instead of copying its implementation.

### Follow the implementation

From [src/add.js, lines 1-2](src/add.js#L1) (source excerpt; run the full application using the command above):

```javascript
export const add = (a, b) => a + b;
console.log(add(2, 3));
```

From [test/add.test.js, lines 1-4](test/add.test.js#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { add } from "../src/add.js";
test("adds", () => assert.equal(add(2, 3), 5));
```

### Why this produces the observed result

The demo checks the executable output and then runs the test file with Node's test runner. A printed answer alone would not establish that the reusable function satisfies its contract.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the implementation to subtraction. Identify which output assertion or unit test detects the regression, then restore addition.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-003.png)
- [Original lesson and curated constraints](lesson-brief.txt)
