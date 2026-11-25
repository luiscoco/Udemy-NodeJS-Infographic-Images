# Prompt 106: Unit tests

Category: Node.js core · Purpose: Verify small pieces of behavior independently.
Test a configuration parser using node:test and node:assert/strict. Cover valid values, boundaries, and malformed input, and introduce one deliberate defect to verify the tests detect it.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 106
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Boundary tests check valid ports and reject malformed/unsafe input.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A unit test exercises a small contract without external services. Boundary values reveal mistakes that a single typical input can miss.

### Follow the implementation

From [config.mjs, lines 1-6](config.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
export function port(value) {
  if (!/^\d+$/.test(String(value))) throw Error("Invalid port");
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 65535) throw Error("Invalid port");
  return n;
}
```

From [config.test.mjs, lines 1-10](config.test.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { port } from "./config.mjs";
test("port boundaries", () => {
  assert.equal(port("3000"), 3000);
  assert.equal(port(1), 1);
  assert.equal(port(65535), 65535);
  for (const input of [0, -1, 65536, "abc", ""])
    assert.throws(() => port(input), /Invalid port/);
});
```

### Why this produces the observed result

The port tests accept both legal endpoints and reject out-of-range, empty, and malformed values. Assertions describe observable behavior instead of repeating the function's internal condition verbatim.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a fractional port and a numeric string containing trailing junk. Predict whether each should be accepted before extending the test cases.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-106.png)
- [Original lesson and curated constraints](lesson-brief.txt)
