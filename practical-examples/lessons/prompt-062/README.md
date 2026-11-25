# Prompt 62: Fetch, cancellation, and HTTP errors

Category: Node.js core · Purpose: Make reliable outbound web requests.
Build a client using native fetch against a local fault-injection server. Handle non-success HTTP statuses, invalid JSON, cancellation, and timeouts, verifying response bodies are consumed or canceled appropriately.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 062
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A local fault server demonstrates HTTP status errors, invalid JSON and cancellation without relying on the public internet.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

fetch distinguishes transport failure from HTTP failure: a 404 response normally resolves, while invalid JSON fails when its body is parsed. Cancellation is another independent error path.

### Follow the implementation

From [demo.mjs, lines 1-25](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer } from "node:http";
import { assert, listen, close, delay } from "../../shared/lab.mjs";
const server = createServer(async (q, s) => {
    if (q.url === "/slow") await delay(100);
    s.writeHead(q.url === "/missing" ? 404 : 200);
    s.end(q.url === "/bad" ? "{" : '{"ok":true}');
  }),
  base = await listen(server);
async function read(path, signal) {
  const r = await fetch(base + path, { signal });
  if (!r.ok) {
    await r.body?.cancel();
    throw Error("HTTP " + r.status);
  }
  return r.json();
}
try {
  console.log(await read("/data", AbortSignal.timeout(1000)));
  await assert.rejects(read("/missing"), /HTTP 404/);
  await assert.rejects(read("/bad"), SyntaxError);
  await assert.rejects(read("/slow", AbortSignal.timeout(10)));
  console.log("status, JSON and deadline errors observed");
} finally {
  await close(server);
}
```

### Why this produces the observed result

The read helper checks `ok`, cancels unwanted bodies, and accepts an abort signal. A local fault server makes each case repeatable without relying on an external website.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a response with status 500 and valid JSON. Predict whether fetch or the explicit status check reports failure first, and compare it with the invalid-JSON case.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-062.png)
- [Original lesson and curated constraints](lesson-brief.txt)
