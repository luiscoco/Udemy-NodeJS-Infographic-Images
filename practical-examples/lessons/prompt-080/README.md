# Prompt 80: OpenAPI contracts

Category: Ecosystem · Purpose: Make API behavior discoverable and reviewable.
Generate an OpenAPI document using fastify and @fastify/swagger. Verify documented request and response schemas match actual endpoint behavior, including at least one error response.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 080
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The generated OpenAPI document contains the real route and agrees with its response contract.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An OpenAPI document describes routes and their data contracts for clients and documentation tools. Generating it from registered route schemas reduces duplicated contract definitions.

### Follow the implementation

From [demo.mjs, lines 1-28](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Fastify from "fastify";
import swagger from "@fastify/swagger";
import assert from "node:assert/strict";
const app = Fastify();
try {
  await app.register(swagger, {
    openapi: { info: { title: "Tasks API", version: "1.0.0" } },
  });
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: { type: "object", properties: { ok: { type: "boolean" } } },
        },
      },
    },
    async () => ({ ok: true }),
  );
  await app.ready();
  const doc = app.swagger();
  console.log(JSON.stringify(doc, null, 2));
  assert.equal(doc.info.title, "Tasks API");
  assert.ok(doc.paths["/health"]);
  assert.equal((await app.inject("/health")).json().ok, true);
} finally {
  await app.close();
}
```

### Why this produces the observed result

The swagger plugin is registered before the route, and the application is ready before generating its document. The demo checks both the documented path and the route's actual response.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a documented response property and verify it appears in both the generated specification and the returned object. Explain why a specification alone cannot establish database behavior.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-080.png)
- [Original lesson and curated constraints](lesson-brief.txt)
