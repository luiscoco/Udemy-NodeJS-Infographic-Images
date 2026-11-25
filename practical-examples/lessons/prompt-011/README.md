# Prompt 11: Collections and identity

Category: JavaScript · Purpose: Select collections according to lookup and ownership needs.
Build a deduplication example using Set, an ID lookup using Map, and object metadata using WeakMap. Verify equality behavior and explain which collections support enumeration and predictable retention.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 011
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Set removes repeated primitives; distinct objects remain distinct; WeakMap stores non-enumerable object metadata.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Map associates keys with values, Set tracks unique values, and WeakMap attaches metadata to object keys without exposing an enumeration of those keys.

### Follow the implementation

From [demo.mjs, lines 1-12](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const users = new Map([[7, { name: "Luis" }]]),
  meta = new WeakMap();
const user = users.get(7);
meta.set(user, { selected: true });
console.log(
  [...new Set([1, 1, 2])],
  user.name,
  meta.get(user),
  new Set([{}, {}]).size,
);
assert.equal(new Set([{}, {}]).size, 2);
```

### Why this produces the observed result

Object identity matters: two separate `{}` expressions create distinct objects even if their contents look equal. The WeakMap lookup succeeds because it uses the same user object retrieved from Map.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Store two objects with identical names in a Set, then insert the same object twice. Predict both sizes and explain which equality rule produced them.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-011.png)
- [Original lesson and curated constraints](lesson-brief.txt)
