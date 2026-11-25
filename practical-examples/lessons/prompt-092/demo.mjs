import { redisLab } from "../../shared/redis.mjs";
import assert from "node:assert/strict";
await using lab = await redisLab();
const subscriber = lab.client.duplicate();
subscriber.on("error", () => {});
await subscriber.connect();
const channel = lab.prefix + "updates",
  stream = lab.prefix + "events";
try {
  const received = new Promise((resolve) =>
    subscriber.subscribe(channel, resolve),
  );
  await new Promise((r) => setTimeout(r, 30));
  await lab.client.publish(channel, "hello");
  assert.equal(await received, "hello");
  await subscriber.unsubscribe(channel);
  await lab.client.publish(channel, "offline message");
  const id = await lab.client.xAdd(stream, "*", { type: "hello" });
  await lab.client.xGroupCreate(stream, "workers", "0", { MKSTREAM: true });
  const rows = await lab.client.xReadGroup(
    "workers",
    "c1",
    { key: stream, id: ">" },
    { COUNT: 1 },
  );
  console.log(rows);
  assert.equal(rows[0].messages[0].id, id);
  assert.equal(await lab.client.xAck(stream, "workers", id), 1);
  console.log("Pub/Sub live delivery vs retained stream read+ACK");
} finally {
  await subscriber.quit();
}
