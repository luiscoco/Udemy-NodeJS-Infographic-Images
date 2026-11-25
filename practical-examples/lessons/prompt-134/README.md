# Prompt 134: Trusted code in VM contexts

Category: Node.js core · Purpose: Run trusted scripts with separate global state.
Execute a trusted expression using node:vm with a dedicated context and execution timeout. Verify global-state separation and explain why this mechanism must not be treated as secure isolation for hostile code.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 134
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Trusted code uses separate global state and the synchronous infinite-loop fixture times out. vm is not a security boundary.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A vm context gives trusted code a separate global environment. Changing a context property does not create the same property on the host's globalThis.

### Follow the implementation

From [demo.mjs, lines 1-16](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import vm from "node:vm";
import assert from "node:assert/strict";
const scope = { count: 1 };
vm.createContext(scope);
const script = new vm.Script("count+=2;count");
console.log(
  script.runInContext(scope, { timeout: 50 }),
  scope.count,
  globalThis.count,
);
assert.equal(scope.count, 3);
assert.equal(globalThis.count, undefined);
assert.throws(() =>
  new vm.Script("while(true){}").runInContext(scope, { timeout: 10 }),
);
console.log("synchronous execution timeout observed");
```

### Why this produces the observed result

The synchronous execution timeout stops the fixture's infinite loop. A vm context is not a security boundary for hostile code, and this synchronous timeout is not a complete lifetime policy for arbitrary async work.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the context's initial count and predict both host and context values. Explain which isolation is demonstrated and why it is narrower than an operating-system sandbox.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-134.png)
- [Original lesson and curated constraints](lesson-brief.txt)
