# Prompt 55: Pipelines and failure cleanup

Category: Node.js core · Purpose: Coordinate stream completion and errors.
Build a file transformation with node:stream/promises.pipeline. Inject a transform error and an abort signal, verifying all streams close and incomplete output is handled according to a stated policy.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 055
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Pipeline failure destroys participants and removes partial output; an incomplete result is never published.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A pipeline connects stream backpressure and error propagation. If a transform fails, the pipeline rejects and destroys the participating streams instead of reporting a successful partial result.

### Follow the implementation

From [demo.mjs, lines 1-25](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Readable, Transform } from "node:stream";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const partial = join(lab.path, "output.part"),
  target = join(lab.path, "output.txt");
try {
  await pipeline(
    Readable.from(["one", "two"]),
    new Transform({
      transform(c, e, done) {
        done(Error("injected transform failure"));
      },
    }),
    createWriteStream(partial),
  );
  await fs.rename(partial, target);
} catch (e) {
  await fs.rm(partial, { force: true });
  console.log(e.message);
}
await assert.rejects(fs.access(partial));
await assert.rejects(fs.access(target));
console.log("no partial or published output");
```

### Why this produces the observed result

Writing to a temporary path separates processing from publication. Rename occurs only after successful completion, while the failure branch removes the partial file.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Let the first chunk through and fail on the second. Verify that neither a partial file nor a published target remains, and explain why a successful first write is not a successful pipeline.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-055.png)
- [Original lesson and curated constraints](lesson-brief.txt)
