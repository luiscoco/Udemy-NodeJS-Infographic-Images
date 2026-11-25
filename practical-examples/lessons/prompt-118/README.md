# Prompt 118: Runtime measurements

Category: Node.js core · Purpose: Detect pressure on the event loop.
Measure operation duration, event-loop utilization, and event-loop delay using node:perf_hooks. Introduce blocking work and verify the measurements reveal it, including correct conversion of reported units.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 118
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual duration, utilization and delay reveal blocking work. Delay nanoseconds are converted to milliseconds.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Elapsed duration, event-loop utilization, and event-loop delay measure different effects. A busy loop occupies the JavaScript thread and delays scheduled callbacks.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { performance, monitorEventLoopDelay } from "node:perf_hooks";
import { delay, assert } from "../../shared/lab.mjs";
const histogram = monitorEventLoopDelay({ resolution: 5 });
histogram.enable();
try {
  await delay(20);
  const before = performance.eventLoopUtilization(),
    start = performance.now();
  while (performance.now() - start < 40) {}
  await delay(20);
  const metrics = {
    durationMs: performance.now() - start,
    utilization: performance.eventLoopUtilization(before).utilization,
    maxDelayMs: histogram.max / 1e6,
  };
  console.log(metrics);
  assert.ok(metrics.utilization >= 0 && metrics.utilization <= 1);
  assert.ok(metrics.maxDelayMs > 0);
} finally {
  histogram.disable();
}
```

### Why this produces the observed result

The histogram is enabled before the blocking interval and sampled after the loop has had time to observe it. Histogram delay is in nanoseconds, so the displayed milliseconds require conversion.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the busy-loop duration and compare the measurements. Explain why a low average request time alone could hide occasional event-loop stalls.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-118.png)
- [Original lesson and curated constraints](lesson-brief.txt)
