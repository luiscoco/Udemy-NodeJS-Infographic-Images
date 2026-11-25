# Prompt 68: Process lifecycle and signals

Category: Node.js core · Purpose: Make termination behavior deliberate.
Build a long-running CLI that handles supported termination signals and uses meaningful exit codes. Verify cleanup executes once and document how signal behavior differs between Windows and POSIX.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 068
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A finite harness calls idempotent shutdown twice but cleans up only once.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Signals request a lifecycle transition. An idempotent shutdown function records that cleanup has started, stops owned work, and ignores repeated requests.

### Follow the implementation

From [lifecycle.mjs, lines 1-15](lifecycle.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
let closing = false;
const timer = setInterval(() => console.log("working"), 1000);
function shutdown() {
  if (closing) return;
  closing = true;
  clearInterval(timer);
  console.log("cleaned up");
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
if (!process.argv.includes("--interactive"))
  setTimeout(() => {
    shutdown();
    shutdown();
  }, 20);
```

### Why this produces the observed result

Both signal handlers delegate to the same function. The finite harness calls it twice without depending on platform-specific signal delivery, while interactive use can exercise terminal signals.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Invoke shutdown three times in the finite fixture and count cleanup messages. Explain why the guard must be set before asynchronous cleanup is added.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-068.png)
- [Original lesson and curated constraints](lesson-brief.txt)
