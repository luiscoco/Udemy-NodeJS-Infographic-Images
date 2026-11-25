import { Worker } from "bullmq";
import { Pool } from "pg";
import { redisConnection } from "../../shared/redis.mjs";
import { publishResult } from "../../shared/outbox.mjs";
if (!/^lab_[a-f0-9]+$/.test(process.env.COURSE_SCHEMA ?? ""))
  throw Error("Invalid lab schema");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: "-c search_path=" + process.env.COURSE_SCHEMA,
});
const worker = new Worker(
  process.env.COURSE_QUEUE,
  async (job) => {
    await publishResult(pool, job.data.reportId, job.data.reportId);
    process.exit(99);
  },
  {
    connection: redisConnection(),
    lockDuration: 1000,
    stalledInterval: 500,
    maxStalledCount: 2,
  },
);
worker.on("error", () => {});
await worker.waitUntilReady();
process.send("ready");
