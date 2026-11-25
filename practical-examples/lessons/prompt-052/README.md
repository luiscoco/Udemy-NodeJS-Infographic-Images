# Prompt 52: Asynchronous event listeners

Category: Node.js core · Purpose: Handle failures from event-driven asynchronous work.
Create an EventEmitter example with an async listener that rejects. Demonstrate an appropriate rejection-handling strategy and verify the failure is observed without an unhandled rejection.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 052
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

emit returns immediately; the rejected async listener reaches the configured synchronous error observer.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An async listener returns a promise, but `emit` returns a boolean describing listener presence. Awaiting emit would not wait for that listener's asynchronous completion.

### Follow the implementation

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { EventEmitter, once } from "node:events";
import assert from "node:assert/strict";
const events = new EventEmitter({ captureRejections: true });
const observed = new Promise((resolve) => events.once("error", resolve));
events.on("job", async () => {
  throw Error("job failed");
});
const returned = events.emit("job");
assert.equal(returned, true);
console.log("emit returns boolean, not the listener promise:", returned);
const error = await observed;
console.log("observed:", error.message);
assert.equal(error.message, "job failed");
```

### Why this produces the observed result

With captureRejections enabled, the listener's rejection reaches the emitter's error event. A synchronous error observer handles that path without creating another rejected async error listener.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add an awaited delay before the listener throws. Observe that emit returns first, then explain why an application needing a completion result should expose a promise-based operation.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-052.png)
- [Original lesson and curated constraints](lesson-brief.txt)
