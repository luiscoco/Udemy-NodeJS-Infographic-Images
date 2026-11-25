# Prompt 127: Graceful shutdown

Category: Node.js core · Purpose: Finish or terminate active work within a bounded shutdown period.
Add coordinated shutdown to a service with HTTP requests, long-lived connections, and background work. Stop admission, drain or close resources, enforce a deadline, and verify termination during active traffic.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 127
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real HTTP request drains before a real SQLite connection closes; shutdown is idempotent.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Graceful shutdown stops new work and drains accepted work before closing dependencies that in-flight requests may still need. Shutdown also needs an idempotent entry guard.

### Follow the implementation

From [demo.mjs, lines 1-30](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer } from "node:http";
import { Database } from "node:sqlite";
import { assert, listen, close, delay } from "../../shared/lab.mjs";
const db = new Database(":memory:");
let stopping = false;
const timer = setInterval(() => {}, 1000);
let entered;
const started = new Promise((r) => (entered = r));
const server = createServer(async (q, s) => {
  entered();
  await delay(30);
  s.end("finished");
});
const base = await listen(server),
  request = fetch(base).then((r) => r.text());
await started;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  clearInterval(timer);
  await close(server);
  db.close();
}
await shutdown();
assert.equal(await request, "finished");
await shutdown();
assert.throws(() => db.exec("SELECT 1"));
console.log(
  "in-flight request drained, producer stopped, database closed, repeated shutdown ignored",
);
```

### Why this produces the observed result

The example starts a request, closes the listening server, waits for that request's response, and only then closes SQLite. A repeated shutdown is ignored rather than closing resources twice.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Move the database close earlier in an experimental branch and explain which kind of real handler could then fail. Restore the drain-before-close order.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-127.png)
- [Original lesson and curated constraints](lesson-brief.txt)
