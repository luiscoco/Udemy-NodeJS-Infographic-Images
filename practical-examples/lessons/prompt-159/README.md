# Prompt 159: Browser-Compatible HTTP Objects

Build a multipart upload client with native Blob, File, FormData, Headers and Request objects. Send it with fetch to the upload fixture from Prompt 81, inspect the response, and verify the multipart boundary is generated automatically.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 159
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual multipart server accepts the generated File; automatic boundary detection is true and the response is 200.

## Walkthrough and experiments

Prerequisite: the separate local upload server from Prompt 81 is listening and accepts the multipart file field. No external client package is required. Blob holds immutable bytes, File adds name/metadata, FormData encodes multipart fields, Headers manages headers, Request describes the request and fetch resolves to a Response. Let fetch/FormData set Content-Type with its boundary; never manually set a bare multipart/form-data header. Request and Response bodies are one-use streams; clone before consuming if a second independent read is needed. The status comes from the fixture; HTTP errors do not automatically reject fetch. The tiny in-memory Blob is a lab example, not a bounded-memory large-file uploader. Complete the exercise: missing file, server 413, cancellation, and body consumption/cleanup.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-159.png)
- [Original lesson and curated constraints](lesson-brief.txt)
