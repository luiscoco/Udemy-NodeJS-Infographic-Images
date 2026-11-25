# Prompt 60: Core HTTP server

Category: Node.js core · Purpose: Understand the request-response foundation beneath frameworks.
Build a node:http JSON server with two routes, explicit status codes, body-size limits, and request timeouts. Verify unknown routes, malformed JSON, and oversized requests.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 060
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real HTTP API is exercised through success, missing route, malformed JSON and body-limit cases.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An HTTP server must map method and path to a response, consume request bodies, and handle invalid input explicitly. The example returns distinct 200, 400, 404, and 413 outcomes.

### Follow the implementation

From [../../shared/core-http.mjs, lines 8-28](../../shared/core-http.mjs#L8) (source excerpt; run the full application using the command above):

```javascript
    try {
      if (req.method === "GET" && req.url === "/health")
        return send(200, { ok: true });
      if (req.method !== "POST" || req.url !== "/echo")
        return send(404, { error: "Not found" });
      let size = 0,
        large = false,
        chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 1024) {
          large = true;
          chunks = [];
        } else if (!large) chunks.push(chunk);
      }
      if (large) return send(413, { error: "Too large" });
      try {
        send(200, JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        send(400, { error: "Invalid JSON" });
      }
```

From [demo.mjs, lines 6-16](demo.mjs#L6) (source excerpt; run the full application using the command above):

```javascript
  for (const [path, options, status] of [
    ["/health", {}, 200],
    ["/missing", {}, 404],
    ["/echo", { method: "POST", body: '{"ok":true}' }, 200],
    ["/echo", { method: "POST", body: "{" }, 400],
    ["/echo", { method: "POST", body: "x".repeat(1025) }, 413],
  ]) {
    const response = await fetch(base + path, options);
    console.log(path, response.status, await response.text());
    assert.equal(response.status, status);
  }
```

### Why this produces the observed result

The body loop counts bytes before parsing JSON and discards buffered data after exceeding its cap. A response must end, and the harness closes the listening server after exercising real requests.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add one valid echo case at the size boundary and one just above it. Explain why validating JSON syntax cannot replace a byte limit on the body.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-060.png)
- [Original lesson and curated constraints](lesson-brief.txt)
