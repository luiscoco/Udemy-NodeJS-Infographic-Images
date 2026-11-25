# Prompt 92: Pub/Sub versus durable streams

Category: Ecosystem · Purpose: Choose messaging behavior according to delivery requirements.
Use the redis package to compare Pub/Sub with Redis Streams consumer groups. Disconnect a consumer, publish messages, reconnect, and verify the different recovery and acknowledgment behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 092
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Pub/Sub delivers only to a live subscriber; the retained stream is read through a consumer group and acknowledged.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Pub/Sub sends transient notifications to currently connected subscribers. A Redis Stream retains entries that a consumer group can read and acknowledge later.

### Follow the implementation

From [demo.mjs, lines 1-32](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { redisLab } from "../../shared/redis.mjs";
import assert from "node:assert/strict";
await using lab = await redisLab();
const subscriber = lab.client.duplicate();
subscriber.on("error", () => {});
await subscriber.connect();
const channel = lab.prefix + "updates",
  stream = lab.prefix + "events";
try {
  const received = new Promise((resolve) =>
    subscriber.subscribe(channel, resolve),
  );
  await new Promise((r) => setTimeout(r, 30));
  await lab.client.publish(channel, "hello");
  assert.equal(await received, "hello");
  await subscriber.unsubscribe(channel);
  await lab.client.publish(channel, "offline message");
  const id = await lab.client.xAdd(stream, "*", { type: "hello" });
  await lab.client.xGroupCreate(stream, "workers", "0", { MKSTREAM: true });
  const rows = await lab.client.xReadGroup(
    "workers",
    "c1",
    { key: stream, id: ">" },
    { COUNT: 1 },
  );
  console.log(rows);
  assert.equal(rows[0].messages[0].id, id);
  assert.equal(await lab.client.xAck(stream, "workers", id), 1);
  console.log("Pub/Sub live delivery vs retained stream read+ACK");
} finally {
  await subscriber.quit();
}
```

### Why this produces the observed result

The fixture unsubscribes before one publication, then contrasts that live-only path with a stored stream entry. Acknowledgement records processing progress; applications must still define pending-entry recovery and retention.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the stream before and after ACK. Explain why acknowledging an entry is different from deleting its stored bytes or proving the business update was committed.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-092.png)
- [Original lesson and curated constraints](lesson-brief.txt)
