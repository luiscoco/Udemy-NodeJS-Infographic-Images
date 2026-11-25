# Prompt 56: Async iteration over streams

Category: Node.js core · Purpose: Process streams using familiar asynchronous control flow.
Consume a file stream with for await...of, stopping after a configured byte count. Verify early termination releases the resource and compare this behavior with full consumption.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 056
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Early async-iterator break destroys the source and releases its file handle.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A readable stream is an async iterable, so a consumer can await chunks using normal loop control. It need not load the complete file before acting on the first bytes.

### Follow the implementation

From [demo.mjs, lines 1-14](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createReadStream } from "node:fs";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "fixture.bin");
await fs.writeFile(file, Buffer.alloc(10000));
const stream = createReadStream(file, { highWaterMark: 1024 });
let bytes = 0;
for await (const chunk of stream) {
  bytes += chunk.length;
  if (bytes >= 4096) break;
}
console.log({ bytes, destroyed: stream.destroyed });
assert.ok(bytes >= 4096);
assert.equal(stream.destroyed, true);
```

### Why this produces the observed result

Breaking default stream async iteration destroys this source and releases its resources. Chunk sizes may vary, so the stopping condition uses a byte threshold rather than an exact iteration count.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Stop after a different byte threshold and inspect `destroyed`. Explain why the last chunk can carry the count beyond the requested threshold.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-056.png)
- [Original lesson and curated constraints](lesson-brief.txt)
