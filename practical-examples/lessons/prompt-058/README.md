# Prompt 58: Streaming compression

Category: Node.js core · Purpose: Reduce data size without buffering entire files.
Build streaming gzip and Brotli round trips using node:zlib. Verify restored checksums, handle corrupted input, and enforce a decompressed-output limit.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 058
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both codecs round-trip actual bytes and reject an output budget smaller than the fixture. Sizes are measured.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Compression and decompression can be stream stages, preserving backpressure instead of buffering an entire file in application memory. The same flow compares gzip and Brotli.

### Follow the implementation

From [demo.mjs, lines 24-28](demo.mjs#L24) (source excerpt; run the full application using the command above):

```javascript
  await pipeline(
    createReadStream(input, { highWaterMark: 128 }),
    zip(),
    createWriteStream(packed),
  );
```

From [demo.mjs, lines 29-54](demo.mjs#L29) (source excerpt; run the full application using the command above):

```javascript
  async function restore(limit) {
    let count = 0;
    try {
      await pipeline(
        createReadStream(packed),
        unzip(),
        new Transform({
          transform(chunk, encoding, done) {
            count += chunk.length;
            done(
              count > limit ? Error("Decompressed budget exceeded") : null,
              chunk,
            );
          },
        }),
        createWriteStream(partial),
      );
      await fs.rename(partial, target);
    } finally {
      await fs.rm(partial, { force: true });
    }
  }
  await restore(bytes.length);
  assert.equal(digest(await fs.readFile(target)), digest(bytes));
  await assert.rejects(restore(32), /budget/);
  assert.equal(digest(await fs.readFile(target)), digest(bytes));
```

### Why this produces the observed result

The restore path counts decompressed bytes cumulatively and rejects output above a budget. A checksum verifies restored content, while temporary-file publication preserves the previous good output after failure.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Lower the decompression budget below the original size. Verify the previous destination checksum remains unchanged and explain why compressed input size alone cannot bound expanded output.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-058.png)
- [Original lesson and curated constraints](lesson-brief.txt)

The practical application streams both gzip and Brotli file pipelines, verifies SHA-256, enforces a cumulative decompressed-byte limit, and preserves the previous target when an oversized restore fails.
