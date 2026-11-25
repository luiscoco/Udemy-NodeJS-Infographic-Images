import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { Registry, Counter, Histogram } from "prom-client";
import { trace, context, propagation } from "@opentelemetry/api";
import { buildTaskApi } from "../../shared/task-api.mjs";
import { createReport } from "../../shared/outbox.mjs";
import { sdk } from "./instrumentation.mjs";
import "../../shared/env.mjs";
if (!/^[a-f0-9]{64}$/i.test(process.env.JWT_KEY ?? ""))
  throw Error("Run tools/setup.mjs to configure JWT_KEY");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  options: "-c search_path=course_app",
  connectionTimeoutMillis: 2000,
  statement_timeout: 3000,
});
const app = await buildTaskApi({
    pool,
    key: Buffer.from(process.env.JWT_KEY, "hex"),
    logger: true,
  }),
  registry = new Registry(),
  requests = new Counter({
    name: "course_http_requests_total",
    help: "Requests",
    labelNames: ["route", "status"],
    registers: [registry],
  }),
  duration = new Histogram({
    name: "course_http_duration_seconds",
    help: "Request duration",
    labelNames: ["route"],
    registers: [registry],
  });
app.addHook("onRequest", async (req) => {
  req.courseSpan = trace.getTracer("course-api").startSpan("http.request");
  req.courseStarted = performance.now();
});
app.addHook("onResponse", async (req, reply) => {
  const route = req.routeOptions.url ?? "unmatched";
  requests.inc({ route, status: String(reply.statusCode) });
  duration.observe({ route }, (performance.now() - req.courseStarted) / 1000);
  req.log.info(
    {
      traceId: req.courseSpan.spanContext().traceId,
      route,
      status: reply.statusCode,
    },
    "request complete",
  );
  req.courseSpan.end();
});
app.get("/instance", async () => ({
  instance: process.env.HOSTNAME ?? String(process.pid),
}));
app.get("/metrics", async (q, r) =>
  r.type(registry.contentType).send(await registry.metrics()),
);
app.post("/reports", { preHandler: app.authenticate }, async (q, r) => {
  const requestId = q.headers["idempotency-key"] ?? randomUUID();
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(requestId))
    return r.code(400).send({ error: "Invalid idempotency key" });
  const id = q.user.sub + "-" + requestId;
  await createReport(pool, id, q.user.sub);
  return r.code(202).send({ id });
});
app.get("/reports/:id", { preHandler: app.authenticate }, async (q, r) => {
  const row = (
    await pool.query(
      "SELECT id,status,result FROM reports WHERE id=$1 AND owner_id=$2",
      [q.params.id, q.user.sub],
    )
  ).rows[0];
  return row ?? r.code(404).send({ error: "Not found" });
});
await app.listen({
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? "0.0.0.0",
});
let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  app.courseState.stopping = true;
  app.log.info({ signal }, "shutting down");
  const deadline = setTimeout(() => process.exit(1), 10000);
  deadline.unref();
  try {
    await app.close();
    await pool.end();
    await sdk.shutdown();
    clearTimeout(deadline);
  } catch {
    process.exitCode = 1;
  }
}
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
