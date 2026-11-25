# Prompt 8: Scope and closures

Category: JavaScript · Purpose: Understand captured state and variable lifetime.
Implement a counter factory using closures and block-scoped variables. Create two counters and verify independent state; include a loop-capture example that demonstrates the difference between var and let.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 008
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Independent counters produce [1,2,1]; var closures see 3,3,3 and let closures see 0,1,2.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A closure retains access to the lexical variables from the call that created it. Each call to `counter()` creates a separate `n`, so the two returned functions do not share a counter.

### Follow the implementation

From [demo.mjs, lines 1-18](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
function counter() {
  let n = 0;
  return () => ++n;
}
const a = counter(),
  b = counter();
const values = [a(), a(), b()];
console.log(values);
assert.deepEqual(values, [1, 2, 1]);
const wrong = [],
  right = [];
for (var i = 0; i < 3; i++) wrong.push(() => i);
for (let j = 0; j < 3; j++) right.push(() => j);
console.log(
  wrong.map((f) => f()),
  right.map((f) => f()),
);
```

### Why this produces the observed result

The loop example isolates a different boundary: `var` supplies one shared loop binding, while `let` supplies a binding for each iteration. Invoking the functions later exposes which variable each captured.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Call `b()` twice more and predict the result. Then replace the `let` loop with `var` and explain why all callbacks report the final loop value.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-008.png)
- [Original lesson and curated constraints](lesson-brief.txt)
