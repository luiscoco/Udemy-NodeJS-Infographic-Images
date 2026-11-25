# Prompt 81: Streaming file uploads

Category: Ecosystem · Purpose: Accept uploads without unbounded buffering or unsafe filenames.
Build an upload endpoint using fastify and @fastify/multipart. Generate storage names, limit file sizes and part counts, and verify oversized or interrupted uploads remove partial files.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 081
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real multipart client uploads a small file; an oversized stream yields 413 and removes its partial output.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Multipart uploads are streams whose filenames and sizes come from an untrusted client. The shared upload handler generates its own destination name and enforces a byte limit.

### Follow the implementation

From [../../shared/upload.mjs, lines 1-31](../../shared/upload.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { rm, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
export async function uploadApp(directory) {
  const app = Fastify();
  await mkdir(directory, { recursive: true });
  await app.register(multipart, {
    limits: { fileSize: 1024, files: 1, parts: 2 },
  });
  app.post("/upload", async (q, r) => {
    const part = await q.file();
    if (!part) return r.code(400).send({ error: "File required" });
    const target = join(directory, randomUUID());
    try {
      await pipeline(part.file, createWriteStream(target, { flags: "wx" }));
      if (part.file.truncated) {
        await rm(target, { force: true });
        return r.code(413).send({ error: "Too large" });
      }
      return { stored: true };
    } catch (error) {
      await rm(target, { force: true });
      throw error;
    }
  });
  return app;
}
```

From [demo.mjs, lines 7-20](demo.mjs#L7) (source excerpt; run the full application using the command above):

```javascript
  for (const [size, status] of [
    [5, 200],
    [2048, 413],
  ]) {
    const form = new FormData();
    form.append("file", new Blob(["x".repeat(size)]), "unsafe-client-name.txt");
    const response = await fetch(
      "http://127.0.0.1:" + app.server.address().port + "/upload",
      { method: "POST", body: form },
    );
    console.log({ size, status: response.status, body: await response.text() });
    assert.equal(response.status, status);
  }
  assert.equal((await fs.readdir(lab.path)).length, 1);
```

### Why this produces the observed result

The finite client sends a small and an oversized file. Only the completed small upload remains, showing that an error response also requires partial-file cleanup.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the client filename to include path-like text and inspect the generated destination name. Explain why accepting the client name as a server path would be unsafe.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-081.png)
- [Original lesson and curated constraints](lesson-brief.txt)
