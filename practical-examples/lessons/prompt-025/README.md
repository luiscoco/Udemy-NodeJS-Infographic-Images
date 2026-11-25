# Prompt 25: Bounded concurrency

Category: JavaScript · Purpose: Prevent large workloads from overwhelming resources.
Implement an asynchronous task runner with a configurable concurrency limit and no external package. Process twenty tasks, inject failures, and assert that active work never exceeds the configured limit.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 025
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Twenty tasks preserve result order with at most three active; one failure does not stop the remaining work.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Bounded concurrency separates the number of tasks from the number allowed to run at once. A small group of runners claims task indexes and stores each result at its original position.

### Follow the implementation

From [demo.mjs, lines 2-19](demo.mjs#L2) (source excerpt; run the full application using the command above):

```javascript
async function run(tasks, limit) {
  if (!Number.isInteger(limit) || limit < 1) throw Error("limit");
  let next = 0;
  const results = [];
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (next < tasks.length) {
        const i = next++;
        try {
          results[i] = { status: "fulfilled", value: await tasks[i]() };
        } catch (reason) {
          results[i] = { status: "rejected", reason: reason.message };
        }
      }
    }),
  );
  return results;
}
```

From [demo.mjs, lines 33-37](demo.mjs#L33) (source excerpt; run the full application using the command above):

```javascript
const rows = await run(tasks, 3);
console.log({ max, rows });
assert.ok(max <= 3);
assert.equal(rows[5].status, "rejected");
await assert.rejects(run(tasks, 0));
```

### Why this produces the observed result

Each task catches its own failure and releases its active slot in `finally`, so one rejected task does not stop the remaining tasks or leak capacity.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Set the limit to one and then five. Check the measured maximum, preserved result order, and recorded failure; keep the invalid-zero case as a boundary check.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-025.png)
- [Original lesson and curated constraints](lesson-brief.txt)
