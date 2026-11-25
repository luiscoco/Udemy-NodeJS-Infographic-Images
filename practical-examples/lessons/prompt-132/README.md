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

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-132.png)
- [Original lesson and curated constraints](lesson-brief.txt)
