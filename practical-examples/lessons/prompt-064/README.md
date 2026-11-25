# Prompt 64: HTTP/2 multiplexing

Category: Node.js core · Purpose: Understand concurrent streams within a connection.
Build an HTTP/2 server and client using node:http2. Send multiple requests over one session, cancel one stream, and verify the remaining streams complete and the session closes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 064
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two HTTP/2 streams share a session; cancelling one does not cancel the other. Cleartext is for this loopback lab only.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

HTTP/2 multiplexes independent streams over one session. Cancelling a stream should release that operation without closing the shared session needed by its sibling.

### Follow the implementation

From [demo.mjs, lines 1-29](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer, connect, constants } from "node:http2";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = createServer();
server.on("stream", (stream, headers) => {
  stream.on("error", () => {});
  stream.respond({ ":status": 200 });
  stream.end(headers[":path"]);
});
const base = await listen(server),
  session = connect(base);
session.on("error", () => {});
try {
  const complete = new Promise((resolve, reject) => {
    const request = session.request({ ":path": "/a" });
    let text = "";
    request.on("data", (c) => (text += c));
    request.on("error", reject);
    request.on("end", () => resolve(text));
    request.end();
  });
  const cancelled = session.request({ ":path": "/b" });
  cancelled.on("error", () => {});
  cancelled.close(constants.NGHTTP2_CANCEL);
  assert.equal(await complete, "/a");
  console.log("first stream completed while second was cancelled");
} finally {
  session.destroy();
  await close(server);
}
```

### Why this produces the observed result

The loopback fixture uses cleartext HTTP/2 for this protocol exercise. Stream and session lifetimes are separate, so both need deliberate cleanup.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Cancel the other stream instead and observe which request completes. Explain why destroying the session would affect both requests.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-064.png)
- [Original lesson and curated constraints](lesson-brief.txt)
