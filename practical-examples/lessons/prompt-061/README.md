# Prompt 61: HTTP clients and connection reuse

Category: Node.js core · Purpose: Understand socket reuse and client resource ownership.
Build a node:http client using an explicitly configured Agent. Measure connection reuse across requests, enforce a socket limit, and verify the Agent is closed after the workload.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 061
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The first connection is new; subsequent reuse is measured, not assumed. The owned Agent is destroyed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A keep-alive Agent owns a pool of sockets that can serve multiple requests. `maxSockets` limits active connections for the relevant destination instead of creating an unlimited connection per call.

### Follow the implementation

From [demo.mjs, lines 1-24](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Agent, get, createServer } from "node:http";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = createServer((q, s) => s.end("ok")),
  base = await listen(server),
  agent = new Agent({ keepAlive: true, maxSockets: 2 });
function request() {
  return new Promise((resolve, reject) => {
    const req = get(base, { agent }, (res) => {
      res.resume();
      res.once("end", () => resolve(req.reusedSocket));
      res.once("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(1000, () => req.destroy(Error("Timeout")));
  });
}
try {
  const reuse = [await request(), await request()];
  console.log({ reuse });
  assert.equal(reuse[0], false);
} finally {
  agent.destroy();
  await close(server);
}
```

### Why this produces the observed result

The response body is consumed so its connection can return to the pool. The example measures `reusedSocket` and destroys its Agent at the end rather than assuming reuse is guaranteed.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Send additional sequential requests and record reusedSocket. Explain how leaving a response body unread can interfere with connection reuse.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-061.png)
- [Original lesson and curated constraints](lesson-brief.txt)
