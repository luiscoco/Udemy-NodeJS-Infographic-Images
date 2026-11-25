# Prompt 35: Circular dependencies

Category: Node.js core · Purpose: Recognize initialization-order problems.
Construct a small circular ESM dependency that fails during initialization. Refactor the shared responsibility into a third module and verify the public behavior remains unchanged.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 035
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

An eagerly evaluated cycle fails; extracting shared state removes the cycle.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Circular ES module dependencies can expose a binding before its initialization. The broken fixture eagerly reads across a cycle and produces ReferenceError.

### Follow the implementation

From [a.mjs, lines 1-2](a.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { b } from "./b.mjs";
export const a = b + 1;
```

From [b.mjs, lines 1-2](b.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { a } from "./a.mjs";
export const b = a + 1;
```

From [fixed-a.mjs, lines 1-2](fixed-a.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { base } from "./shared.mjs";
export const value = base + 1;
```

From [shared.mjs, lines 1-1](shared.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
export const base = 1;
```

### Why this produces the observed result

The corrected files move shared state into a module that both sides can depend on without the eager cycle. Delaying access can sometimes change symptoms, but a clear dependency direction is easier to reason about.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Draw the import edges for the broken and fixed files. Identify the first binding read that occurs before initialization, then explain how the shared module removes that dependency loop.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-035.png)
- [Original lesson and curated constraints](lesson-brief.txt)
