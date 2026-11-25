import { Pool } from "pg";
import { Queue, Worker } from "bullmq";
import { publishResult } from "../../shared/outbox.mjs";
import { redisConnection } from "../../shared/redis.mjs";
import { sdk } from "../task-api/instrumentation.mjs";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  options: "-c search_path=course_app",
  connectionTimeoutMillis: 2000,
  statement_timeout: 3000,
});
const connection = redisConnection();
const queue = new Queue("reports", {
  connection: {
    ...connection,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  },
});
const worker = new Worker(
  "reports",
  async (job) => {
    if (process.env.FAIL_FIRST_ATTEMPT === "1" && job.attemptsMade === 0)
      throw Error("Controlled transient failure");
    return publishResult(pool, job.data.eventId, job.data.reportId);
  },
  { connection, concurrency: 2 },
);
worker.on("error", () => console.error("Worker connection unavailable"));
let stopping = false,
  timer,
  polling;
async function relay() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rows = (
      await client.query(
        "SELECT * FROM outbox WHERE published=false ORDER BY id LIMIT 10 FOR UPDATE SKIP LOCKED",
      )
    ).rows;
    for (const event of rows) {
      await queue.add(
        "generate",
        { eventId: event.id, ...event.payload },
        {
          jobId: event.id,
          attempts: 3,
          backoff: { type: "exponential", delay: 1000 },
        },
      );
      await client.query("UPDATE outbox SET published=true WHERE id=$1", [
        event.id,
      ]);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
function schedule() {
  if (stopping) return;
  polling = relay()
    .catch(() => console.error("Outbox relay will retry"))
    .finally(() => {
      if (!stopping) timer = setTimeout(schedule, 250);
    });
}
schedule();
async function shutdown() {
  if (stopping) return;
  stopping = true;
  clearTimeout(timer);
  const deadline = setTimeout(() => process.exit(1), 10000);
  deadline.unref();
  try {
    await polling;
    await worker.close();
    await queue.close();
    await pool.end();
    await sdk.shutdown();
    clearTimeout(deadline);
  } catch {
    process.exitCode = 1;
  }
}
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
