import { pgLab } from "../../shared/postgres.mjs";
import { redisLab } from "../../shared/redis.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
await using redis = await redisLab();
const {
  rows: [task],
} = await db.pool.query("INSERT INTO tasks(title) VALUES('first') RETURNING *");
const key = redis.prefix + "task:" + task.id;
let loads = 0;
async function load() {
  try {
    const hit = await redis.client.get(key);
    if (hit !== null) return JSON.parse(hit);
  } catch {}
  loads++;
  const value = (
    await db.pool.query("SELECT * FROM tasks WHERE id=$1", [task.id])
  ).rows[0];
  try {
    await redis.client.set(key, JSON.stringify(value), { EX: 30 });
  } catch {}
  return value;
}
await load();
await load();
assert.equal(loads, 1);
await db.pool.query("UPDATE tasks SET title=$1 WHERE id=$2", [
  "changed",
  task.id,
]);
await redis.client.del(key);
assert.equal((await load()).title, "changed");
await redis.client.quit();
assert.equal((await load()).title, "changed");
console.log({ databaseLoads: loads, cacheFailureFallback: true });
