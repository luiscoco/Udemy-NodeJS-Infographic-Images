# Prompt 115: Structured logging

Category: Ecosystem · Purpose: Produce logs that support filtering and diagnosis.
Add pino logging to a small API with structured errors and request identifiers. Configure redaction and verify credentials and sensitive fields are absent from captured logs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 115
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real JSON logs preserve the correlation ID and structured error while removing configured sensitive fields.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Structured logs preserve fields that tools can query, such as action and requestId. A child logger attaches context consistently instead of repeating it in free-form messages.

### Follow the implementation

From [demo.mjs, lines 1-29](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import pino from "pino";
import { Writable } from "node:stream";
import assert from "node:assert/strict";
let output = "";
const sink = new Writable({
  write(c, e, done) {
    output += c;
    done();
  },
});
const log = pino(
  {
    redact: { paths: ["password", "req.headers.authorization"], remove: true },
  },
  sink,
).child({ requestId: "req-001" });
log.info(
  {
    password: "public-demo-password",
    req: { headers: { authorization: "Bearer public-demo-token" } },
    action: "login",
  },
  "request",
);
log.error({ err: Error("fixture failure") }, "failed");
console.log(output);
assert.ok(!output.includes("public-demo-password"));
assert.ok(!output.includes("public-demo-token"));
assert.equal(JSON.parse(output.split("\n")[0]).requestId, "req-001");
```

### Why this produces the observed result

Configured redaction removes password and authorization fields, while Error serialization retains useful failure structure. The example checks actual output so a redaction configuration typo cannot go unnoticed.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add another sensitive nested fixture and its redaction path. Verify the value is absent from serialized logs while requestId remains available.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-115.png)
- [Original lesson and curated constraints](lesson-brief.txt)
