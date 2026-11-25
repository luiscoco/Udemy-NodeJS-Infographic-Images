import { queueLab } from "../../shared/jobs.mjs";
import assert from "node:assert/strict";
let attempts = 0;
await using lab = await queueLab(async (job) => {
  attempts++;
  if (job.attemptsMade < 2) throw Error("transient fixture");
  return { reportId: job.data.reportId };
});
const job = await lab.queue.add(
  "generate",
  { reportId: "r1" },
  {
    jobId: "report-r1",
    attempts: 3,
    backoff: { type: "exponential", delay: 10 },
  },
);
const value = await job.waitUntilFinished(lab.events, 10000);
console.log({ value, attempts });
assert.equal(attempts, 3);
