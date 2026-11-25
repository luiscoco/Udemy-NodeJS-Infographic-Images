# Prompt 145: WASI — experimental

Category: Node.js core · Purpose: Explore system interfaces for WebAssembly programs.
Build a tiny file-reading program with the external WASI SDK and run it through node:wasi. Configure a fixture-directory preopen, verify expected output, and document the implementation’s security limitations.
Node explicitly cautions against relying on its WASI implementation to run untrusted code securely. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 145
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real WASI program opens hello.txt through its preopened directory and prints Hello from WASI.

## Walkthrough and experiments

The default reproducible demo assembles the supplied WAT with wabt. The equivalent read.c and build.ps1 are supplied for the external WASI SDK route; do not claim the C compiler ran. Node WASI preopens are convenience mappings, not a comprehensive security sandbox.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-145.png)
- [Original lesson and curated constraints](lesson-brief.txt)
