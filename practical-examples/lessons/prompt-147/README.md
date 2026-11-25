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

## Walkthrough and experiments

Windows: run cl /LD add.c /Fe:mylib.dll in Developer PowerShell. Linux: cc -shared -fPIC -o mylib.so add.c. macOS: cc -dynamiclib -o mylib.dylib add.c. Under the Permission Model grant --allow-ffi. Invalid signatures/pointers can crash the process; do not call after close.

## Requirements and validation

Execution mode: **native-tooling**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-147.png)
- [Original lesson and curated constraints](lesson-brief.txt)
