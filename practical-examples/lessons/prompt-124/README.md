# Prompt 124: Resource budgets

Category: Node.js core · Purpose: Keep overload from causing uncontrolled memory growth.
Build a service with explicit limits for concurrent work, queued work, and payload size. Apply a documented heap limit, overload the service, and verify predictable rejection while tracking heap and total process memory separately.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 124
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Exactly eight slots run concurrently, 32 wait, and the next submission is rejected. All accepted work drains.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Admission control limits active work and queued work separately. Once both budgets are full, rejecting new work prevents an overload from becoming an unbounded memory queue.

### Follow the implementation

From [../../shared/reliability.mjs, lines 2-30](../../shared/reliability.mjs#L2) (source excerpt; run the full application using the command above):

```javascript
export function admission({ maxActive = 8, maxQueued = 32 } = {}) {
  let active = 0,
    max = 0;
  const queue = [];
  function submit(work) {
    if (active >= maxActive && queue.length >= maxQueued)
      return Promise.reject(Error("OVERLOADED"));
    return new Promise((resolve, reject) => {
      const run = async () => {
        active++;
        max = Math.max(max, active);
        try {
          resolve(await work());
        } catch (e) {
          reject(e);
        } finally {
          active--;
          queue.shift()?.();
        }
      };
      if (active < maxActive) void run();
      else queue.push(run);
    });
  }
  return {
    submit,
    stats: () => ({ active, queued: queue.length, maxActive: max }),
  };
}
```

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { admission } from "../../shared/reliability.mjs";
import { assert, delay } from "../../shared/lab.mjs";
const gate = admission();
const jobs = Array.from({ length: 40 }, () =>
  gate.submit(async () => {
    await delay(10);
    return "done";
  }),
);
await assert.rejects(
  gate.submit(async () => {}),
  /OVERLOADED/,
);
await Promise.all(jobs);
console.log(gate.stats());
assert.equal(gate.stats().maxActive, 8);
assert.equal(gate.stats().queued, 0);
```

### Why this produces the observed result

The shared gate releases its slot in finally and starts a queued job. Eight active plus thirty-two waiting jobs are accepted, the next is rejected, and accepted work drains.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Configure a smaller gate and add a failing job. Check that the next queued job still starts and explain why a rejected job must not consume a permanent slot.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-124.png)
- [Original lesson and curated constraints](lesson-brief.txt)
