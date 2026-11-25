# Prompt 120: Distributed tracing

Category: Ecosystem · Purpose: Follow one operation across service boundaries.
Instrument two local HTTP services using @opentelemetry/api, @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, and a console exporter from @opentelemetry/sdk-trace-base. Verify a request produces related spans, using the packages’ documented ESM initialization.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 120
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two actual Node processes propagate W3C trace context through HTTP. Trace IDs and parent-child relationships are asserted.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A distributed trace connects operations across process boundaries. Injecting active W3C context into HTTP headers lets the downstream process extract a parent context and create its own span.

### Follow the implementation

From [demo.mjs, lines 14-33](demo.mjs#L14) (source excerpt; run the full application using the command above):

```javascript
  await trace
    .getTracer("service-a")
    .startActiveSpan("GET downstream", async (span) => {
      try {
        const headers = {};
        propagation.inject(context.active(), headers);
        const response = await fetch("http://127.0.0.1:" + port, { headers });
        const body = await response.json();
        assert.equal(body.traceId, span.spanContext().traceId);
        assert.equal(body.parentSpanId, span.spanContext().spanId);
        console.log(
          "Same trace ID across two processes; child has a distinct span ID:",
          body.spanId !== span.spanContext().spanId,
        );
      } finally {
        span.end();
      }
    });
  await processor.forceFlush();
  assert.equal(exporter.getFinishedSpans().length, 1);
```

### Why this produces the observed result

The test verifies one trace ID with distinct span IDs and the correct parent relationship. Spans are ended and exports flushed before inspecting evidence, so context propagation is checked rather than assumed.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect service-b's extraction code and temporarily omit the outgoing headers. Explain which relationship assertion should fail even though the HTTP request may still succeed.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-120.png)
- [Original lesson and curated constraints](lesson-brief.txt)
