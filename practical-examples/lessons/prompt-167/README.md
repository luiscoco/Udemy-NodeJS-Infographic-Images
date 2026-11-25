# Prompt 167: Zstandard Compression

Round-trip a bounded fixture with Node's Zstandard API, reject decompression that exceeds an output limit, and compare size and CPU cost with gzip and Brotli using measured results.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 167
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

true
limit rejected

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Zstandard compression is available through Node's zlib interface. Promisify adapts its callback API, and Buffer equality verifies a byte-for-byte round trip.

### Follow the implementation

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { zstdCompress, zstdDecompress } from "node:zlib";
import { promisify } from "node:util";

const compress = promisify(zstdCompress);
const decompress = promisify(zstdDecompress);
const original = Buffer.from("Node.js\n".repeat(100));
const packed = await compress(original);
const restored = await decompress(packed, { maxOutputLength: 1_024 });
console.log(restored.equals(original));

try {
  await decompress(packed, { maxOutputLength: 32 });
  throw new Error("Expected the size limit to reject");
} catch (error) {
  if (error.code !== "ERR_BUFFER_TOO_LARGE") throw error;
  console.log("limit rejected");
}
```

### Why this produces the observed result

The decompressor's maxOutputLength caps expanded output for this buffered operation. The second call deliberately exceeds the cap and checks ERR_BUFFER_TOO_LARGE rather than accepting a partial decoded result.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Use a more repetitive fixture and compare compressed size, then keep a small output cap. Explain why a tiny compressed file may still require a large decompressed allocation.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Zstandard APIs in node:zlib have Stability 1 Experimental on Node 26.13.1; no extra experimental flag is required for this sample. maxOutputLength bounds output for convenience methods, it is not a total-process memory bound. The source fixture is 800 bytes; the 32-byte cap rejects it. Do not invent compression ratio or timing. This buffer-based example is intentionally small; for large files use createZstdCompress/createZstdDecompress with pipeline, backpressure, and an independent cumulative decompressed-byte limiter. A stream chunkSize is not a total output-size cap. Complete the exercise: gzip/Brotli/Zstd round trips, corrupted input rejection, cleanup after failure and measured size/CPU/latency tradeoffs with runtime/hardware recorded.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-167.png)
- [Original lesson and curated constraints](lesson-brief.txt)
