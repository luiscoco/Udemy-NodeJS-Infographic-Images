# Prompt 77: Express middleware

Category: Ecosystem · Purpose: Understand a common request-processing abstraction.
Build a minimal express application with request logging, routing, and error middleware. Record execution order and verify an error reaches the error handler without sending two responses.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 077
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Express 5 forwards rejected route promises to the four-argument error middleware; unknown routes remain 404.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Express middleware forms an ordered chain. A normal middleware calls next to continue; a four-argument error middleware handles errors passed down the error path.

### Follow the implementation

From [demo.mjs, lines 1-34](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import express from "express";
import { createServer } from "node:http";
import { assert, listen, close } from "../../shared/lab.mjs";
const app = express(),
  order = [];
app.use((q, r, next) => {
  order.push("before");
  next();
});
app.get("/tasks", (q, r) => r.json([]));
app.get("/fail", async () => {
  throw Error("fixture");
});
app.use((e, q, r, next) => {
  if (r.headersSent) return next(e);
  order.push("error");
  r.status(500).json({ error: "Internal error" });
});
const server = createServer(app),
  base = await listen(server);
try {
  for (const [path, status] of [
    ["/tasks", 200],
    ["/fail", 500],
    ["/missing", 404],
  ]) {
    const r = await fetch(base + path);
    console.log(path, r.status, await r.text());
    assert.equal(r.status, status);
  }
  console.log(order);
} finally {
  await close(server);
}
```

### Why this produces the observed result

Express 5 forwards a rejected async route promise to that handler. Checking headersSent avoids attempting a second response, and an unmatched route remains a 404.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Insert middleware after the failing route and record whether the normal or error path reaches it. Explain why error-handler placement and its four parameters matter.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-077.png)
- [Original lesson and curated constraints](lesson-brief.txt)
