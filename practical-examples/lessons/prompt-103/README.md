# Prompt 103: Outbound-request restrictions

Category: Node.js core · Purpose: Prevent user input from choosing unintended network destinations.
Build a download service whose destination comes from a fixed server-side allowlist rather than an arbitrary user URL. Disable or revalidate redirects and verify attempts to reach unapproved destinations fail.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 103
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A server-owned destination map, redirect rejection and body cap are tested against a real loopback fixture.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An outbound-request boundary can accept a destination name instead of an arbitrary URL. The server-owned map limits the destinations the application can contact.

### Follow the implementation

From [demo.mjs, lines 1-41](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer } from "node:http";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = createServer((q, s) => {
  if (q.url === "/redirect") {
    s.writeHead(302, { location: "http://127.0.0.1:9/private" });
    s.end();
  } else s.end(q.url === "/large" ? "x".repeat(2048) : "allowed");
});
const base = await listen(server),
  destinations = new Map([
    ["docs", new URL(base)],
    ["redirect", new URL("/redirect", base)],
    ["large", new URL("/large", base)],
  ]);
async function download(name) {
  const url = destinations.get(name);
  if (!url) throw Error("Unknown destination");
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(1000),
  });
  let bytes = 0;
  try {
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > 1024) throw Error("Body too large");
    }
    return bytes;
  } finally {
    if (!response.body.locked) await response.body.cancel().catch(() => {});
  }
}
try {
  console.log("allowlisted bytes", await download("docs"));
  await assert.rejects(download("http://internal.invalid"), /Unknown/);
  await assert.rejects(download("redirect"));
  await assert.rejects(download("large"), /large/);
  console.log("unknown destination, redirect and body budget rejected");
} finally {
  await close(server);
}
```

### Why this produces the observed result

Redirect rejection prevents an allowed endpoint from silently forwarding the request elsewhere, and a cumulative body cap limits downloaded bytes. A deadline bounds waiting; these controls address different resource and routing risks.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Use the redirect and oversized fixtures separately. Explain why an initial allowlist check would be insufficient if redirects were followed automatically.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-103.png)
- [Original lesson and curated constraints](lesson-brief.txt)
