# Prompt 13: Serialization and numeric boundaries

Category: JavaScript · Purpose: Preserve meaning when data crosses JSON boundaries.
Create a serializer for records containing dates and large integer identifiers. Demonstrate BigInt, unsafe integer precision, and cyclic-object failures, then verify a documented JSON representation round-trips correctly.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 013
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A decimal string preserves an integer beyond Number.MAX_SAFE_INTEGER; dates need explicit reconstruction.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

JSON cannot encode BigInt directly, and a Number cannot exactly represent every integer beyond its safe range. The application transports the identifier as a decimal string to preserve its digits.

### Follow the implementation

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const row = {
  id: 9007199254740993n,
  createdAt: new Date("2026-01-01T00:00:00Z"),
};
assert.throws(() => JSON.stringify(row), TypeError);
const json = JSON.stringify({
  id: String(row.id),
  createdAt: row.createdAt.toISOString(),
});
const parsed = JSON.parse(json);
const restored = {
  id: BigInt(parsed.id),
  createdAt: new Date(parsed.createdAt),
};
console.log(json, restored.id === row.id);
assert.equal(restored.id, row.id);
```

### Why this produces the observed result

A parsed date is also a string until explicitly reconstructed. Serialization defines a boundary contract: the sender chooses stable representations, and the receiver restores the intended types.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Round-trip `9007199254740993n` through `Number()` instead of `String()` and compare the restored value. Explain why the original decimal-string route preserves identity.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-013.png)
- [Original lesson and curated constraints](lesson-brief.txt)
