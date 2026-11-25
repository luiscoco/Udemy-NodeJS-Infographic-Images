import { createServer } from "node:http";
import { trace, context, propagation } from "@opentelemetry/api";
import { telemetry } from "../../shared/telemetry.mjs";
const { sdk } = await telemetry();
const server = createServer((q, r) => {
  const parent = propagation.extract(context.active(), q.headers),
    span = trace.getTracer("service-b").startSpan("receive", undefined, parent);
  const result = {
    traceId: span.spanContext().traceId,
    spanId: span.spanContext().spanId,
    parentSpanId: trace.getSpanContext(parent)?.spanId,
  };
  r.setHeader("content-type", "application/json");
  r.end(JSON.stringify(result));
  span.end();
});
server.listen(0, "127.0.0.1", () =>
  process.send({ port: server.address().port }),
);
process.on("message", async (m) => {
  if (m === "stop") {
    await new Promise((r) => server.close(r));
    await sdk.shutdown();
    process.disconnect();
  }
});
