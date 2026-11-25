# Prompt 17: Event-loop phases

Category: Node.js core · Purpose: Reason about when callbacks can execute.
Create an experiment using a filesystem callback, setTimeout, and setImmediate. Repeat it inside and outside an I/O callback, recording observations while distinguishing guaranteed ordering from timing-dependent results.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 017
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Inside the I/O callback immediate precedes timeout. Top-level timeout/immediate order is deliberately not asserted.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Timers and immediates enter different event-loop phases. Scheduling them from an I/O callback provides a context where the immediate runs before the newly scheduled timeout.

### Follow the implementation

From [demo.mjs, lines 1-7](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { readFile } from "node:fs";
setTimeout(() => console.log("outer timeout"), 0);
setImmediate(() => console.log("outer immediate"));
readFile(new URL(import.meta.url), () => {
  setTimeout(() => console.log("I/O timeout"), 0);
  setImmediate(() => console.log("I/O immediate"));
});
```

### Why this produces the observed result

The top-level timeout/immediate pair is intentionally observed without a fixed-order assertion. An ordering seen on one run is weaker evidence than a guarantee tied to a specific scheduling context.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Label a second I/O callback and compare its messages. Explain why observing the same top-level order repeatedly is insufficient to make it a portable contract.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-017.png)
- [Original lesson and curated constraints](lesson-brief.txt)
