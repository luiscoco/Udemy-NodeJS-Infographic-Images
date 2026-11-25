# Prompt 49: Text encodings and chunk boundaries

Category: Node.js core · Purpose: Decode streamed text without corrupting characters.
Split UTF-8 text containing emoji into arbitrary byte chunks and decode it with StringDecoder. Compare naive decoding and verify the correct output for every possible split point.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 049
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Every possible two-chunk split preserves the Unicode text; incomplete bytes are buffered until decoder end.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A stream chunk can end in the middle of a UTF-8 character. Decoding each chunk independently can replace the incomplete sequence and corrupt the text.

### Follow the implementation

From [demo.mjs, lines 1-12](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { StringDecoder } from "node:string_decoder";
import assert from "node:assert/strict";
const text = "café 😀",
  bytes = Buffer.from(text);
for (let i = 0; i <= bytes.length; i++) {
  const decoder = new StringDecoder("utf8");
  assert.equal(
    decoder.write(bytes.subarray(0, i)) + decoder.end(bytes.subarray(i)),
    text,
  );
}
console.log("All split points preserved:", bytes.length + 1);
```

### Why this produces the observed result

StringDecoder retains incomplete bytes until the next chunk or the final `end` call. Testing every split position proves the result does not depend on a convenient chunk boundary.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Replace the fixture with several emoji and rerun all splits. Explain why concatenating independently decoded chunk strings is weaker than maintaining one decoder per stream.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-049.png)
- [Original lesson and curated constraints](lesson-brief.txt)
