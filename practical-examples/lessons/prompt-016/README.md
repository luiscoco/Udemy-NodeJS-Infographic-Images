# Prompt 16: Blocking versus nonblocking execution

Category: Node.js core · Purpose: Understand why a responsive server can become blocked.
Build a server with one delayed-I/O endpoint and one CPU-heavy endpoint. Send overlapping requests and measure responsiveness; demonstrate why adding async to CPU-heavy code does not make that work parallel.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 016
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Concurrent I/O waits overlap; synchronous CPU work serializes the server. Printed durations are measurements, not fixed timing promises.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Awaiting an asynchronous wait releases the JavaScript thread so another request can progress. A synchronous busy loop occupies that thread and delays other request handlers even though the handler is declared async.

### Follow the implementation

From [demo.mjs, lines 1-28](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer } from "node:http";
import { listen, close, delay } from "../../shared/lab.mjs";
const server = createServer(async (req, res) => {
  try {
    if (req.url === "/io") await delay(100);
    else {
      const end = performance.now() + 100;
      while (performance.now() < end) {}
    }
    res.end("done");
  } catch {
    res.writeHead(500);
    res.end();
  }
});
const base = await listen(server);
try {
  for (const route of ["/io", "/cpu"]) {
    const start = performance.now();
    await Promise.all([
      fetch(base + route).then((r) => r.text()),
      fetch(base + route).then((r) => r.text()),
    ]);
    console.log(route, Math.round(performance.now() - start), "measured ms");
  }
} finally {
  await close(server);
}
```

### Why this produces the observed result

The two concurrent requests exercise both paths through a real HTTP server. Elapsed times are measurements affected by startup and scheduling, so the example compares behavior without promising exact milliseconds.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Increase the busy-loop duration and send several concurrent requests. Explain why adding `async` to the handler does not make that CPU loop execute on another thread.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-016.png)
- [Original lesson and curated constraints](lesson-brief.txt)
