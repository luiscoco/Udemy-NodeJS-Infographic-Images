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
