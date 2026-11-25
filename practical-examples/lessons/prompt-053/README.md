# Prompt 53: Readable and writable backpressure

Category: Node.js core · Purpose: Keep producer speed aligned with consumer capacity.
Connect a fast producer to a deliberately slow writable stream. Respect write() results and drain, and verify buffered data remains bounded as total processed input increases.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 053
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The slow sink receives every chunk exactly once while the producer honors drain. highWaterMark is a threshold, not a universal memory cap.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Writable backpressure tells a producer when to pause. A false return from `write` means the chunk was accepted into the stream but the producer should wait for drain before writing more.

### Follow the implementation

From [demo.mjs, lines 7-23](demo.mjs#L7) (source excerpt; run the full application using the command above):

```javascript
const slow = new Writable({
  highWaterMark: 4096,
  write(chunk, enc, done) {
    bytes += chunk.length;
    setTimeout(done, 1);
  },
});
for (let i = 0; i < 50; i++) {
  const accepted = slow.write(Buffer.alloc(1024));
  maxQueued = Math.max(maxQueued, slow.writableLength);
  if (!accepted) await once(slow, "drain");
}
slow.end();
await finished(slow);
console.log({ bytes, maxQueued });
assert.equal(bytes, 50 * 1024);
assert.ok(maxQueued <= 4096);
```

### Why this produces the observed result

The loop writes each chunk once and measures queued bytes. highWaterMark is a buffering threshold, not a universal memory cap; chunk size, other buffers, and object mode affect memory use.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Increase the chunk size beyond highWaterMark. Observe the queue measurement and explain why retrying the same chunk after drain would duplicate data.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-053.png)
- [Original lesson and curated constraints](lesson-brief.txt)
