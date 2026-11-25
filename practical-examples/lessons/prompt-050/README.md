# Prompt 50: File watching

Category: Node.js core · Purpose: React to changes while accommodating imperfect notifications.
Build a directory watcher with debouncing and periodic reconciliation. Test rapid edits, replacement, and deletion, treating notifications as hints rather than assuming one event per change.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 050
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Reconciliation serializes scans and reaches the real directory state despite coalesced watcher hints.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Filesystem watcher events are hints to reconcile state, rather than a complete transaction log. Events may be duplicated or coalesced, so the application re-reads the actual directory.

### Follow the implementation

From [demo.mjs, lines 1-34](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { watch } from "node:fs";
import { assert, fs, temp, join, delay } from "../../shared/lab.mjs";
await using lab = await temp();
let scans = 0,
  snapshot = [],
  pending = Promise.resolve();
function reconcile() {
  pending = pending.then(async () => {
    snapshot = await fs.readdir(lab.path);
    scans++;
  });
  return pending;
}
let debounce;
const watcher = watch(lab.path, () => {
  clearTimeout(debounce);
  debounce = setTimeout(reconcile, 15);
});
watcher.on("error", (e) => console.error(e.code));
const periodic = setInterval(reconcile, 50);
try {
  await reconcile();
  await fs.writeFile(join(lab.path, "a.txt"), "one");
  await fs.writeFile(join(lab.path, "a.txt"), "two");
  await delay(150);
  await reconcile();
  assert.deepEqual(snapshot, ["a.txt"]);
  console.log({ scans, snapshot });
} finally {
  clearTimeout(debounce);
  clearInterval(periodic);
  watcher.close();
  await pending;
}
```

### Why this produces the observed result

A promise chain serializes scans, debounce limits bursts, and periodic reconciliation supplies another opportunity to converge. Cleanup closes the watcher and timers and waits for pending work.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Write the same file rapidly several times. Check the final snapshot instead of asserting an exact event count, and explain why that is the useful application invariant.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-050.png)
- [Original lesson and curated constraints](lesson-brief.txt)
