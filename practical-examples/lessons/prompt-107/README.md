# Prompt 107: Asynchronous tests and teardown

Category: Node.js core · Purpose: Make asynchronous tests complete and clean up reliably.
Write tests around a temporary HTTP server and directory using test lifecycle hooks. Verify rejected promises fail the test and teardown closes resources even when an assertion fails.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 107
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real HTTP fixture uses an OS-assigned port; test cleanup closes it even when assertions fail.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An asynchronous test must await the behavior it verifies and own the resources it starts. Binding to port zero lets the OS choose an available test port.

### Follow the implementation

From [async.test.mjs, lines 1-12](async.test.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { listen, close, temp, fs, join } from "../../shared/lab.mjs";
test("HTTP fixture owns resources", async (t) => {
  await using lab = await temp();
  await fs.writeFile(join(lab.path, "record"), "fixture");
  const server = createServer((q, s) => s.end("ok"));
  const base = await listen(server);
  t.after(() => close(server));
  assert.equal(await (await fetch(base)).text(), "ok");
});
```

### Why this produces the observed result

The test registers server teardown with `t.after`, while the temporary directory uses explicit resource management. Cleanup is registered before the assertion so a failing check does not leave the server listening.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Temporarily make the expected response wrong and observe test failure without a hanging process. Explain why teardown after the assertion would be less reliable.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-107.png)
- [Original lesson and curated constraints](lesson-brief.txt)
