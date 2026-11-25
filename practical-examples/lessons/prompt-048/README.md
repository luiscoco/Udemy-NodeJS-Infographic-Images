# Prompt 48: Buffers and binary layouts

Category: Node.js core · Purpose: Encode and decode binary protocols.
Define a binary record containing a version byte, integer length, and payload using Buffer and typed arrays. Verify endianness, bounds checking, and round-trip decoding of multiple records.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 048
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A versioned big-endian binary packet round-trips; malformed/truncated frames are rejected.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A binary protocol needs an explicit layout: a version byte, a big-endian length, and payload bytes. Buffer methods read and write integers without relying on text delimiters.

### Follow the implementation

From [demo.mjs, lines 1-16](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const text = Buffer.from("hello");
const packet = Buffer.alloc(5 + text.length);
packet[0] = 1;
packet.writeUInt32BE(text.length, 1);
text.copy(packet, 5);
function decode(bytes) {
  if (bytes.length < 5) throw Error("Truncated header");
  const size = bytes.readUInt32BE(1);
  if (bytes[0] !== 1 || size > 1024 || bytes.length !== 5 + size)
    throw Error("Invalid record");
  return bytes.subarray(5).toString("utf8");
}
console.log(packet, decode(packet));
assert.throws(() => decode(packet.subarray(0, 4)));
assert.throws(() => decode(packet.subarray(0, 6)));
```

### Why this produces the observed result

The decoder verifies the minimum header, protocol version, maximum size, and exact frame length before reading the payload. Rejecting truncation prevents treating incomplete transport data as a valid record.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the version byte or declared length and predict the rejection. Explain why byte order must be agreed by both encoder and decoder.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-048.png)
- [Original lesson and curated constraints](lesson-brief.txt)
