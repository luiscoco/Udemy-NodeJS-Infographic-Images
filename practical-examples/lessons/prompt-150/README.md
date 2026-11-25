# Prompt 150: Iterable Streams API — experimental

Category: Node.js core · Purpose: Compare a newer streaming interface with established alternatives.
Implement a small transformation using node:stream/iter with its required experimental flag. Verify output, cancellation, and slow-consumer behavior, then compare its interface with a stable classic-stream pipeline.
This API is separate from ordinary, stable for await...of consumption of Node streams. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 150
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Both actual stream interfaces produce uppercase output. The experimental iterable API and stable classic pipeline remain distinct.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

The experimental iterable streams interface and stable classic streams express dataflow through different APIs. Both examples transform text to uppercase, but their integration points remain distinct.

### Follow the implementation

From [iter.mjs, lines 1-8](iter.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { from, pull, text } from "node:stream/iter";
const upper = (chunks) =>
  chunks === null
    ? null
    : chunks.map((c) =>
        new TextEncoder().encode(new TextDecoder().decode(c).toUpperCase()),
      );
console.log(await text(pull(from("hello, iterable streams"), upper)));
```

From [classic.mjs, lines 1-12](classic.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
const upper = new Transform({
  transform(c, e, done) {
    done(null, c.toString().toUpperCase());
  },
});
await pipeline(
  Readable.from(["hello, classic streams"]),
  upper,
  process.stdout,
);
```

### Why this produces the observed result

The harness launches each with the required flags and checks its actual output. The small text fixture demonstrates transformation, not a general proof of incremental UTF-8 decoding across arbitrary chunk boundaries.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare iter.mjs with classic.mjs and identify source, transform, and sink in each. Explain why choosing an experimental interface also affects runtime and deployment requirements.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-150.png)
- [Original lesson and curated constraints](lesson-brief.txt)
