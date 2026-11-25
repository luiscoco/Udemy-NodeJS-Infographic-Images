# Prompt 147: Foreign function interface — experimental, Node.js 26.1+

Category: Node.js core · Purpose: Explore calling a native shared library without writing an addon.
Compile a tiny C shared library and call one function through node:ffi. State build and architecture requirements, verify the signature and result, and explain the consequences of incorrect native type or memory declarations.
This API was added in Node.js 26.1 and remains experimental. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 147
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

After building the supplied native C library for this OS/architecture, FFI returns 42 and closes its handle.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

FFI calls a compiled library using a declared ABI boundary. The JavaScript declaration must agree with the C symbol's argument and return types.

### Follow the implementation

From [demo.mjs, lines 1-12](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { dlopen, suffix } from "node:ffi";
import assert from "node:assert/strict";
const { lib, functions } = dlopen(`./mylib.${suffix}`, {
  add_i32: { arguments: ["int32", "int32"], return: "int32" },
});
try {
  const result = functions.add_i32(20, 22);
  console.log(result);
  assert.equal(result, 42);
} finally {
  lib.close();
}
```

### Why this produces the observed result

The library suffix is platform-specific, and the owned handle is closed in finally. Incorrect ABI declarations can cause native failures, so a successful JavaScript import is not enough; the recorded native pass is Linux Docker evidence.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare add_i32's C declaration with the JavaScript signature. Explain why changing only one side to a wider integer type would be an invalid experiment without rebuilding and matching both sides.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Windows: run cl /LD add.c /Fe:mylib.dll in Developer PowerShell. Linux: cc -shared -fPIC -o mylib.so add.c. macOS: cc -dynamiclib -o mylib.dylib add.c. Under the Permission Model grant --allow-ffi. Invalid signatures/pointers can crash the process; do not call after close.

## Requirements and validation

Execution mode: **native-tooling**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-147.png)
- [Original lesson and curated constraints](lesson-brief.txt)
