# Prompt 76: Framework routing and lifecycle

Category: Ecosystem · Purpose: Organize web behavior beyond a raw HTTP callback.
Build a small task API using fastify with route registration, lifecycle hooks, and centralized error handling. Verify successful requests, unknown routes, and an intentionally rejected handler.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 076
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Fastify lifecycle hooks run; thrown async errors become sanitized 500 responses. Add --serve to inspect endpoints manually.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Fastify routes and hooks define a request lifecycle. A hook runs before route handling, and thrown async route errors flow into the configured error handler.

### Follow the implementation

From [demo.mjs, lines 1-27](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Fastify from "fastify";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify();
const phases = [];
app.addHook("onRequest", async () => {
  phases.push("onRequest");
});
app.setErrorHandler((error, q, r) =>
  r.code(500).send({ error: "Internal error" }),
);
app.get("/tasks", async () => [{ id: 1, title: "Learn Node.js" }]);
app.get("/fail", async () => {
  throw Error("private fixture detail");
});
await inspectApp(app, async () => {
  for (const [url, status] of [
    ["/tasks", 200],
    ["/missing", 404],
    ["/fail", 500],
  ]) {
    const r = await app.inject(url);
    console.log(url, r.statusCode, r.body);
    assert.equal(r.statusCode, status);
  }
  assert.equal(phases.length, 3);
});
```

### Why this produces the observed result

The handler returns a sanitized error body while preserving distinct missing-route behavior. Injection exercises the framework without binding a port; `--serve` supports manual inspection.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add another route and verify the hook count increases. Throw a private detail from it and check that the response still contains only the public error.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-076.png)
- [Original lesson and curated constraints](lesson-brief.txt)
