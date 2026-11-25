# Prompt 57: Web Streams interoperability

Category: Node.js core · Purpose: Connect browser-style APIs with Node stream APIs.
Fetch a large response from a local server and connect its Web Stream body to a Node writable using supported adapters. Verify cancellation propagates and output matches the source.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 057
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real local fetch Web ReadableStream is adapted into a Node pipeline and published only after success.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Native fetch returns a Web ReadableStream, while traditional Node pipeline expects Node streams. `Readable.fromWeb` bridges the two interfaces.

### Follow the implementation

From [demo.mjs, lines 1-22](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { assert, fs, temp, join, listen, close } from "../../shared/lab.mjs";
await using lab = await temp();
const bytes = Buffer.from("Web Streams -> Node streams");
const server = createServer((q, s) => s.end(bytes));
const base = await listen(server);
const part = join(lab.path, "download.part"),
  target = join(lab.path, "download.txt");
try {
  const response = await fetch(base, { signal: AbortSignal.timeout(1000) });
  if (!response.ok || !response.body) throw Error("Download failed");
  await pipeline(Readable.fromWeb(response.body), createWriteStream(part));
  await fs.rename(part, target);
  assert.deepEqual(await fs.readFile(target), bytes);
  console.log("byte-identical download published");
} finally {
  await fs.rm(part, { force: true });
  await close(server);
}
```

### Why this produces the observed result

The application checks HTTP success, streams to a temporary file, then publishes by rename after pipeline completion. Closing the response path and server is part of the operation's resource contract.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Return a non-200 status from the fixture server. Verify that the target is not published and explain why a resolved fetch promise alone does not mean a successful download.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-057.png)
- [Original lesson and curated constraints](lesson-brief.txt)
