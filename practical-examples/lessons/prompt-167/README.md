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

## Walkthrough and experiments

Zstandard APIs in node:zlib have Stability 1 Experimental on Node 26.13.1; no extra experimental flag is required for this sample. maxOutputLength bounds output for convenience methods, it is not a total-process memory bound. The source fixture is 800 bytes; the 32-byte cap rejects it. Do not invent compression ratio or timing. This buffer-based example is intentionally small; for large files use createZstdCompress/createZstdDecompress with pipeline, backpressure, and an independent cumulative decompressed-byte limiter. A stream chunkSize is not a total output-size cap. Complete the exercise: gzip/Brotli/Zstd round trips, corrupted input rejection, cleanup after failure and measured size/CPU/latency tradeoffs with runtime/hardware recorded.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-167.png)
- [Original lesson and curated constraints](lesson-brief.txt)
