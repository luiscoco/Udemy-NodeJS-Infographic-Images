# Prompt 73: Message channels and transferable data

Category: Node.js core · Purpose: Understand the cost and ownership of cross-thread communication.
Compare cloning an ArrayBuffer with transferring it through a MessageChannel. Verify sender-side detachment after transfer and measure the difference using a documented payload size.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 073
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Transfer detaches the sender ArrayBuffer while the receiver owns the original-sized storage.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A transfer list moves ownership of an ArrayBuffer between message endpoints. After transfer, the sender's buffer is detached rather than remaining a usable copy.

### Follow the implementation

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { MessageChannel } from "node:worker_threads";
import assert from "node:assert/strict";
const { port1, port2 } = new MessageChannel(),
  buffer = new ArrayBuffer(1024 * 1024);
const received = new Promise((r) => port2.once("message", r));
port1.postMessage(buffer, [buffer]);
console.log("sender:", buffer.byteLength);
assert.equal(buffer.byteLength, 0);
const value = await received;
console.log("received:", value.byteLength);
assert.equal(value.byteLength, 1048576);
port1.close();
port2.close();
```

### Why this produces the observed result

The sender's byte length becomes zero, while the receiver obtains the original storage size. Message ports remain owned resources and are closed after the exchange.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Remove the transfer list and compare the sender's byte length. Explain the difference between copying a message's data and transferring access to its storage.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-073.png)
- [Original lesson and curated constraints](lesson-brief.txt)
