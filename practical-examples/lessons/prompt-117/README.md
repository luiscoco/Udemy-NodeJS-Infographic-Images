# Prompt 117: Diagnostics channels

Category: Node.js core · Purpose: Expose instrumentation without coupling business logic to subscribers.
Instrument a reusable operation with node:diagnostics_channel. Add and remove a subscriber, verify start and completion events, and avoid constructing expensive diagnostic payloads when nobody subscribes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 117
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Diagnostics are emitted synchronously only while subscribed; business results remain 6 and 8.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Diagnostics channels expose optional lifecycle observations without making subscribers part of the business result. Publication invokes subscribers synchronously.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { channel } from "node:diagnostics_channel";
import assert from "node:assert/strict";
const start = channel("course.operation.start"),
  done = channel("course.operation.done"),
  events = [];
const listener = (value) => events.push(value);
start.subscribe(listener);
done.subscribe(listener);
function operation(value) {
  if (start.hasSubscribers) start.publish({ phase: "start", value });
  try {
    return value * 2;
  } finally {
    if (done.hasSubscribers) done.publish({ phase: "done" });
  }
}
console.log(operation(3));
start.unsubscribe(listener);
done.unsubscribe(listener);
console.log(operation(4), events);
assert.equal(events.length, 2);
```

### Why this produces the observed result

Checking hasSubscribers avoids building unused diagnostic payloads. Unsubscribing owned listeners stops observation while the operation continues to return the same computed values.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Subscribe only to the completion channel and compare captured events. Explain why a slow or throwing diagnostic subscriber can still affect the publishing call.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-117.png)
- [Original lesson and curated constraints](lesson-brief.txt)
