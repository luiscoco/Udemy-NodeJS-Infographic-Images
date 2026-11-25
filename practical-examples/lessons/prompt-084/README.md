# Prompt 84: Browser integration and CORS

Category: Ecosystem · Purpose: Understand browser access rules around an API.
Serve a small page using fastify and @fastify/static, and configure @fastify/cors for a separate allowed origin. Verify browser behavior for allowed and disallowed origins, and demonstrate that CORS does not authenticate nonbrowser clients.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 084
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The API emits its configured allow-origin value. A browser on a different origin cannot read the response even though the HTTP request can succeed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

CORS is a browser response-reading policy. The server declares an allowed origin, and a browser compares that value with the requesting page's origin.

### Follow the implementation

From [demo.mjs, lines 1-28](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Fastify from "fastify";
import cors from "@fastify/cors";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify();
await app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});
app.get("/data", async () => ({ ok: true }));
await inspectApp(app, async () => {
  for (const origin of ["http://localhost:5173", "http://untrusted.invalid"]) {
    const r = await app.inject({ url: "/data", headers: { origin } });
    console.log({
      origin,
      status: r.statusCode,
      allow: r.headers["access-control-allow-origin"],
    });
    assert.equal(r.statusCode, 200);
    assert.equal(
      r.headers["access-control-allow-origin"],
      "http://localhost:5173",
    );
  }
  console.log(
    "CORS headers grant the configured origin; they do not authenticate requests.",
  );
});
```

### Why this produces the observed result

Both injected HTTP requests can succeed even though only the configured browser origin is allowed to read the response. CORS headers neither authenticate callers nor prevent non-browser clients from sending requests.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare response status with Access-Control-Allow-Origin for both origins. Explain why returning 200 to a command-line client does not demonstrate that a browser can read the same response.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Run --serve for the API, then run node browser.mjs in another terminal and open http://localhost:5173. The browser page demonstrates the actual browser-enforced policy.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-084.png)
- [Original lesson and curated constraints](lesson-brief.txt)
