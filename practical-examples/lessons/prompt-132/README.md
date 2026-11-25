# Prompt 132: WebAssembly

Category: Node.js core · Purpose: Execute a portable compiled computation from JavaScript.
Use the wabt package to compile a small WAT function into WebAssembly and invoke it from Node.js. Verify numeric boundaries and compare call overhead with an equivalent JavaScript implementation.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 132
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Compiled WAT executes as WebAssembly; i32 overflow wraps rather than producing the same Number result as unbounded JS.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

WebAssembly executes a compiled module with explicitly typed imports and exports. WAT is a text representation assembled into bytes before instantiation.

### Follow the implementation

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import wabtInit from "wabt";
import assert from "node:assert/strict";
const wabt = await wabtInit(),
  parsed = wabt.parseWat(
    "double.wat",
    '(module (func (export "double") (param i32) (result i32) local.get 0 i32.const 2 i32.mul))',
  );
const { buffer } = parsed.toBinary({});
parsed.destroy();
const { instance } = await WebAssembly.instantiate(buffer);
console.log(instance.exports.double(21), instance.exports.double(2147483647));
assert.equal(instance.exports.double(21), 42);
assert.equal(instance.exports.double(2147483647), -2);
```

### Why this produces the observed result

The exported i32 function doubles 21, but overflow follows 32-bit wrapping arithmetic. That behavior differs from an ordinary JavaScript Number operation and belongs in the boundary contract.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Call the export with another value near the signed 32-bit boundary. Predict the wrapped result and explain why the exported type matters to callers.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-132.png)
- [Original lesson and curated constraints](lesson-brief.txt)
