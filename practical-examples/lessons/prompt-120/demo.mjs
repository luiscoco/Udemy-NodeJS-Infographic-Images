import { fork } from "node:child_process";
import { trace, context, propagation } from "@opentelemetry/api";
import { telemetry } from "../../shared/telemetry.mjs";
import assert from "node:assert/strict";
const { sdk, exporter, processor } = await telemetry(),
  child = fork(new URL("./service-b.mjs", import.meta.url), {
    stdio: ["ignore", "inherit", "inherit", "ipc"],
  });
const port = await new Promise((resolve, reject) => {
  child.once("message", (m) => resolve(m.port));
  child.once("error", reject);
});
try {
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
} finally {
  child.send("stop");
  await new Promise((r) => child.once("exit", r));
  await sdk.shutdown();
}
