# Prompt 66: UDP datagrams

Category: Node.js core · Purpose: Understand message-oriented communication without reliable delivery guarantees.
Build a UDP sender and receiver using node:dgram with sequence numbers. Simulate dropped and reordered messages, report missing sequences, and verify sockets close cleanly.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 066
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The receiver logs actual datagrams and computes missing sequence 4 at the application layer. UDP itself does not promise delivery/order.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

UDP delivers datagrams rather than a byte stream, but it does not promise delivery, ordering, or duplicate suppression. Sequence numbers are an application-level mechanism.

### Follow the implementation

From [demo.mjs, lines 1-38](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createSocket } from "node:dgram";
import assert from "node:assert/strict";
const receiver = createSocket("udp4"),
  sender = createSocket("udp4"),
  seen = [];
let rejectReceive;
const done = new Promise((resolve, reject) => {
  rejectReceive = reject;
  receiver.on("error", reject);
  receiver.on("message", (data) => {
    seen.push(JSON.parse(data).seq);
    if (seen.length === 3) resolve();
  });
});
await new Promise((r) => receiver.bind(0, "127.0.0.1", r));
const timer = setTimeout(
  () => rejectReceive(Error("Datagram receive deadline")),
  2000,
);
try {
  for (const seq of [1, 3, 2])
    await new Promise((resolve, reject) =>
      sender.send(
        JSON.stringify({ seq }),
        receiver.address().port,
        "127.0.0.1",
        (e) => (e ? reject(e) : resolve()),
      ),
    );
  await done;
  const missing = [1, 2, 3, 4].filter((x) => !seen.includes(x));
  console.log({ observed: seen, missing });
  assert.deepEqual(missing, [4]);
} finally {
  clearTimeout(timer);
  sender.close();
  receiver.close();
}
```

### Why this produces the observed result

The fixture receives actual datagrams and computes which expected sequence is absent. A receive deadline prevents an incomplete exchange from hanging indefinitely; it does not repair lost data.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Send the same sequence twice and explain how a Set changes duplicate accounting. Distinguish the intentionally missing fixture sequence from a general guarantee about local UDP delivery.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-066.png)
- [Original lesson and curated constraints](lesson-brief.txt)
