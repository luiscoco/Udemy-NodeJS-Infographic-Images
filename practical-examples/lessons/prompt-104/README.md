# Prompt 104: Abuse and resource controls

Category: Ecosystem · Purpose: Limit resource consumption by expensive requests.
Add @fastify/rate-limit to a fastify API with body limits and execution deadlines. Verify rejection behavior and configure trusted proxies explicitly so forged forwarding headers cannot bypass the chosen policy.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 104
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual rate-limit plugin enforces 20 requests per window and the body cap rejects a separate oversized request.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Request rate and payload size are independent resource budgets. A rate limiter bounds how often a caller can invoke work, while a body limit bounds the amount parsed per request.

### Follow the implementation

From [demo.mjs, lines 1-22](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import assert from "node:assert/strict";
const app = Fastify({ bodyLimit: 1024, trustProxy: false });
await app.register(rateLimit, { max: 20, timeWindow: "1 minute" });
app.get("/work", async () => ({ ok: true }));
app.post("/payload", async () => ({ ok: true }));
try {
  for (let i = 0; i < 20; i++)
    assert.equal((await app.inject("/work")).statusCode, 200);
  assert.equal((await app.inject("/work")).statusCode, 429);
  const oversized = await app.inject({
    method: "POST",
    url: "/payload",
    remoteAddress: "127.0.0.2",
    payload: { text: "x".repeat(2048) },
  });
  assert.equal(oversized.statusCode, 413);
  console.log("rate budget=429; independent oversized request=413");
} finally {
  await app.close();
}
```

### Why this produces the observed result

The demo reaches 429 on the twenty-first request and uses a different client address to exercise 413 independently. Proxy trust affects client identity, so it is explicitly disabled in the fixture.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Lower the rate budget and keep the body-size test independent. Explain why a rate-limit response could otherwise hide whether the body limit was actually tested.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-104.png)
- [Original lesson and curated constraints](lesson-brief.txt)
