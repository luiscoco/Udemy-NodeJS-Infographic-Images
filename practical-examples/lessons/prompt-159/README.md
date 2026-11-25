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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Blob, File, FormData, Request, Headers, and fetch provide browser-compatible HTTP building blocks in Node. File adds a filename to byte content; FormData encodes a multipart request.

### Follow the implementation

From [upload-client.mjs, lines 1-22](upload-client.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
const blob = new Blob(["hello\n"], { type: "text/plain" });
const file = new File([blob], "note.txt", { type: blob.type });
const form = new FormData();
form.append("file", file);

const request = new Request(
  process.env.UPLOAD_URL ?? "http://127.0.0.1:3000/upload",
  {
    method: "POST",
    headers: new Headers({ Accept: "application/json" }),
    body: form,
    signal: AbortSignal.timeout(1_000),
  },
);
console.log(
  request.headers
    .get("content-type")
    .startsWith("multipart/form-data; boundary="),
);
const response = await fetch(request);
console.log(response.status);
await response.body?.cancel();
```

### Why this produces the observed result

The request implementation generates the multipart boundary and Content-Type together. Manually setting that header without the matching boundary would break the server's parsing contract.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the generated header without overriding it, then compare the uploaded file's name and content. Explain why Accept describes the desired response rather than the request body's encoding.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Prerequisite: the separate local upload server from Prompt 81 is listening and accepts the multipart file field. No external client package is required. Blob holds immutable bytes, File adds name/metadata, FormData encodes multipart fields, Headers manages headers, Request describes the request and fetch resolves to a Response. Let fetch/FormData set Content-Type with its boundary; never manually set a bare multipart/form-data header. Request and Response bodies are one-use streams; clone before consuming if a second independent read is needed. The status comes from the fixture; HTTP errors do not automatically reject fetch. The tiny in-memory Blob is a lab example, not a bounded-memory large-file uploader. Complete the exercise: missing file, server 413, cancellation, and body consumption/cleanup.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-159.png)
- [Original lesson and curated constraints](lesson-brief.txt)
