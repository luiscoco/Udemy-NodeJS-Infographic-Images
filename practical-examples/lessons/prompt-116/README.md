# Prompt 116: Asynchronous request context

Category: Node.js core · Purpose: Preserve correlation information across asynchronous operations.
Use AsyncLocalStorage to carry a request ID through promises, timers, and database-like callbacks. Run overlapping requests and verify their context values never mix.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 116
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Overlapping requests retain their own IDs and the outer context remains undefined.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

AsyncLocalStorage associates data with an asynchronous execution chain. Each request starts its own store, so overlapping awaits can recover the correct request ID without passing it through every function.

### Follow the implementation

From [demo.mjs, lines 1-15](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { AsyncLocalStorage } from "node:async_hooks";
import { assert, delay } from "../../shared/lab.mjs";
const context = new AsyncLocalStorage(),
  seen = [];
async function request(id, ms) {
  return context.run({ id }, async () => {
    await Promise.resolve();
    await delay(ms);
    seen.push(context.getStore().id);
  });
}
await Promise.all([request("A", 20), request("B", 5)]);
console.log(seen, context.getStore());
assert.deepEqual(seen, ["B", "A"]);
assert.equal(context.getStore(), undefined);
```

### Why this produces the observed result

The faster request finishes first but still reads its own ID. Outside either run scope there is no request store, showing that the example does not use one mutable global request variable.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Swap the two delays and predict the completion order. Explain why changing order must not change which ID each request observes.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-116.png)
- [Original lesson and curated constraints](lesson-brief.txt)
