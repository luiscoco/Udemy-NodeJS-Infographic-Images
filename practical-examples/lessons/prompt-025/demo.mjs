import { assert, delay } from "../../shared/lab.mjs";
async function run(tasks, limit) {
  if (!Number.isInteger(limit) || limit < 1) throw Error("limit");
  let next = 0;
  const results = [];
  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (next < tasks.length) {
        const i = next++;
        try {
          results[i] = { status: "fulfilled", value: await tasks[i]() };
        } catch (reason) {
          results[i] = { status: "rejected", reason: reason.message };
        }
      }
    }),
  );
  return results;
}
let active = 0,
  max = 0;
const tasks = Array.from({ length: 20 }, (_, i) => async () => {
  active++;
  max = Math.max(max, active);
  try {
    await delay(5);
    if (i === 5) throw Error("fixture failure");
    return i;
  } finally {
    active--;
  }
});
const rows = await run(tasks, 3);
console.log({ max, rows });
assert.ok(max <= 3);
assert.equal(rows[5].status, "rejected");
await assert.rejects(run(tasks, 0));
