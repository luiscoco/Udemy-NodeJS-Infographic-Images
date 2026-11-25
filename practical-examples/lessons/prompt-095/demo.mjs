import { pgLab } from "../../shared/postgres.mjs";
import { createReport, publishResult } from "../../shared/outbox.mjs";
import { queueLab } from "../../shared/jobs.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
await createReport(db.pool, "r1");
await using queue = await queueLab((job) =>
  publishResult(db.pool, job.data.eventId, job.data.reportId),
);
const event = (
  await db.pool.query("SELECT * FROM outbox WHERE published=false")
).rows[0];
for (let delivery = 0; delivery < 2; delivery++) {
  const job = await queue.queue.add(
    "report",
    { eventId: event.id, ...event.payload },
    { jobId: "delivery-" + delivery },
  );
  await job.waitUntilFinished(queue.events, 10000);
}
await db.pool.query("UPDATE outbox SET published=true WHERE id=$1", [event.id]);
assert.equal(
  (await db.pool.query("SELECT count(*) FROM processed_events")).rows[0].count,
  "1",
);
console.log((await db.pool.query("SELECT * FROM reports")).rows);
