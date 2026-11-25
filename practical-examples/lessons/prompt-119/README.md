# Prompt 119: Application metrics

Category: Ecosystem · Purpose: Observe latency, errors, and workload over time.
Use prom-client to expose request counters, a duration histogram, and an in-flight gauge. Verify metrics change under success and failure while labels avoid user IDs and unbounded URL values.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 119
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual Prometheus text includes bounded success/error labels, histogram samples and an in-flight gauge that returns to zero.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Counters accumulate events, histograms record distributions, and gauges represent a value that can rise and fall. Prometheus exposes these as named time series.

### Follow the implementation

From [demo.mjs, lines 22-39](demo.mjs#L22) (source excerpt; run the full application using the command above):

```javascript
app.get("/work", async (q) => {
  active.inc();
  const stop = duration.startTimer();
  try {
    if (q.query.fail) throw Error("fixture failure");
    requests.inc({ outcome: "ok" });
    return { ok: true };
  } catch (e) {
    requests.inc({ outcome: "error" });
    throw e;
  } finally {
    stop();
    active.dec();
  }
});
app.get("/metrics", async (q, r) =>
  r.type(register.contentType).send(await register.metrics()),
);
```

### Why this produces the observed result

The handler increments in-flight work before execution and decrements it in finally, including failure paths. Outcome labels have a small fixed set; using arbitrary user IDs would create unbounded series.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Trigger the failing route again and inspect error count and in-flight gauge. Explain why the gauge must return to zero even when the handler throws.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-119.png)
- [Original lesson and curated constraints](lesson-brief.txt)
