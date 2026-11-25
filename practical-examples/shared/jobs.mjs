import { Queue, QueueEvents, Worker } from "bullmq";
import { randomUUID } from "node:crypto";
import { redisConnection } from "./redis.mjs";
export async function queueLab(processor) {
  const name = "course-" + randomUUID();
  const connection = redisConnection();
  const queue = new Queue(name, { connection }),
    events = new QueueEvents(name, { connection });
  events.on("error", () => {});
  await events.waitUntilReady();
  const worker = new Worker(name, processor, { connection, concurrency: 2 });
  worker.on("error", () => {});
  await worker.waitUntilReady();
  return {
    queue,
    events,
    worker,
    name,
    connection,
    async [Symbol.asyncDispose]() {
      await worker.close();
      await queue.obliterate({ force: true });
      await events.close();
      await queue.close();
    },
  };
}
