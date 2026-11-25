# Prompt 51: EventEmitter lifecycle

Category: Node.js core · Purpose: Connect components through in-process events.
Implement a job object using EventEmitter with progress, completion, and error events. Verify listener ordering, once, listener removal, and cleanup after repeated jobs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 051
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The once listener fires once and the owned progress listener is removed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

EventEmitter invokes registered listeners synchronously. `on` keeps a listener, `once` removes it after one event, and `off` removes a specific owned function.

### Follow the implementation

From [demo.mjs, lines 1-15](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { EventEmitter } from "node:events";
import assert from "node:assert/strict";
const job = new EventEmitter(),
  seen = [];
const progress = (n) => seen.push(n);
job.on("error", (e) => seen.push(e.message));
job.on("progress", progress);
job.once("done", () => seen.push("complete"));
job.emit("progress", 50);
job.emit("done");
job.emit("done");
job.off("progress", progress);
assert.equal(job.listenerCount("progress"), 0);
console.log(seen);
assert.deepEqual(seen, [50, "complete"]);
```

### Why this produces the observed result

The example emits done twice but observes one completion. Removing the progress listener by its original function reference prevents accumulating listeners across repeated jobs.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Emit another progress event after `off` and predict the unchanged array. Explain why creating a new arrow function in the off call would not remove the original listener.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-051.png)
- [Original lesson and curated constraints](lesson-brief.txt)
