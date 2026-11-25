import { Worker } from "bullmq";
import { queueLab } from "../../shared/jobs.mjs";
import { delay, assert } from "../../shared/lab.mjs";
let active = 0,
  max = 0;
const processor = async () => {
  active++;
  max = Math.max(max, active);
  try {
    await delay(20);
    return "done";
  } finally {
    active--;
  }
};
await using lab = await queueLab(processor);
const second = new Worker(lab.name, processor, {
  connection: lab.connection,
  concurrency: 2,
});
second.on("error", () => {});
try {
  await second.waitUntilReady();
  await lab.queue.upsertJobScheduler(
    "nightly-report",
    { pattern: "0 0 9 * * *", tz: "Europe/Madrid" },
    { name: "generate", data: { reportId: "daily" } },
  );
  await lab.queue.setGlobalConcurrency(1);
  console.log(await lab.queue.getJobSchedulers());
  const jobs = await Promise.all(
    [1, 2, 3, 4].map((i) => lab.queue.add("immediate", { i })),
  );
  await Promise.all(
    jobs.map((job) => job.waitUntilFinished(lab.events, 10000)),
  );
  assert.equal(max, 1);
  console.log("maximum active jobs across two workers:", max);
  await lab.queue.removeJobScheduler("nightly-report");
} finally {
  await second.close();
}
