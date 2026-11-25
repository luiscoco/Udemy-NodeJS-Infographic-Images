import Fastify from "fastify";
import { Registry, Counter, Histogram, Gauge } from "prom-client";
import assert from "node:assert/strict";
const register = new Registry(),
  requests = new Counter({
    name: "app_requests_total",
    help: "Requests",
    labelNames: ["outcome"],
    registers: [register],
  }),
  duration = new Histogram({
    name: "app_duration_seconds",
    help: "Duration",
    registers: [register],
  }),
  active = new Gauge({
    name: "app_inflight",
    help: "Active",
    registers: [register],
  }),
  app = Fastify();
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
try {
  await app.inject("/work");
  await app.inject("/work?fail=1");
  const metrics = (await app.inject("/metrics")).body;
  console.log(metrics);
  assert.ok(metrics.includes('outcome="ok"'));
  assert.ok(metrics.includes('outcome="error"'));
  assert.equal((await active.get()).values[0].value, 0);
} finally {
  await app.close();
}
