import { Queue, QueueEvents, Worker } from "bullmq";
import { fork } from "node:child_process";
import { randomUUID } from "node:crypto";
import { pgLab } from "../../shared/postgres.mjs";
import { redisConnection } from "../../shared/redis.mjs";
import { createReport, publishResult } from "../../shared/outbox.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
await createReport(db.pool, "crash-report");
const name = "crash-" + randomUUID(),
  connection = redisConnection(),
  queue = new Queue(name, { connection }),
  events = new QueueEvents(name, { connection });
events.on("error", () => {});
await events.waitUntilReady();
let recovery, child;
try {
  child = fork(new URL("./crash-worker.mjs", import.meta.url), {
    env: { ...process.env, COURSE_SCHEMA: db.schema, COURSE_QUEUE: name },
    stdio: ["ignore", "inherit", "inherit", "ipc"],
  });
  await new Promise((resolve, reject) => {
    child.once("message", resolve);
    child.once("error", reject);
  });
  const exited = new Promise((resolve) => child.once("exit", resolve));
  const job = await queue.add(
    "report",
    { reportId: "crash-report" },
    { attempts: 3, backoff: { type: "exponential", delay: 10 } },
  );
  assert.equal(await exited, 99);
  recovery = new Worker(
    name,
    (job) => publishResult(db.pool, job.data.reportId, job.data.reportId),
    {
      connection,
      lockDuration: 1000,
      stalledInterval: 500,
      maxStalledCount: 2,
    },
  );
  recovery.on("error", () => {});
  await job.waitUntilFinished(events, 15000);
  assert.equal(
    (await db.pool.query("SELECT count(*) FROM processed_events")).rows[0]
      .count,
    "1",
  );
  assert.equal(
    (await db.pool.query("SELECT status FROM reports")).rows[0].status,
    "complete",
  );
  console.log(
    "worker exited 99 after commit; stalled job retried; one durable business result",
  );
} finally {
  if (child?.connected) child.kill();
  await recovery?.close();
  await queue.obliterate({ force: true });
  await events.close();
  await queue.close();
}
