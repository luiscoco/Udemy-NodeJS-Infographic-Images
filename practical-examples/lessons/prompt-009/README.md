# Prompt 9: Objects, destructuring, and mutation

Category: JavaScript · Purpose: Avoid accidental modification of shared data.
Build a function that applies defaults to a nested configuration object using destructuring and nullish coalescing. Demonstrate shallow-copy behavior and verify that the chosen implementation preserves the original input.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 009
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Nullish defaults preserve port 0; copied nested state still shares identity unless copied explicitly.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Object spread copies one level of properties. Creating a new outer object does not automatically create new nested objects, so mutating a shared nested reference can still affect the original.

### Follow the implementation

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const original = { server: { port: 0 }, nested: { enabled: true } };
const configured = {
  ...original,
  server: {
    ...original.server,
    port: original.server.port ?? 3000,
    tls: original.server.tls ?? false,
  },
};
console.log(original, configured);
assert.equal(configured.server.port, 0);
assert.equal(original.server.tls, undefined);
const shallow = { ...original };
shallow.nested.enabled = false;
assert.equal(original.nested.enabled, false);
console.log("shallow copy shares nested object");
```

### Why this produces the observed result

The explicit nested `server` spread makes that level independent. `??` uses a default only for null or undefined, preserving a deliberate value such as port `0`; `

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

|` would replace it.|Replace the port's `??` with `||` and observe the changed value. Then copy `nested` explicitly and verify that changing the copied flag no longer changes the original.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-009.png)
- [Original lesson and curated constraints](lesson-brief.txt)
