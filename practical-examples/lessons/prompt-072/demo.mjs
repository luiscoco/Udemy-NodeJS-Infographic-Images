import Piscina from "piscina";
import assert from "node:assert/strict";
const pool = new Piscina({
  filename: new URL("./worker.mjs", import.meta.url).href,
  minThreads: 2,
  maxThreads: 2,
  maxQueue: 4,
});
try {
  assert.equal(await pool.run(100000), 5000050000);
  const outcomes = await Promise.allSettled(
    Array.from({ length: 12 }, () => pool.run(1000000)),
  );
  console.log({
    fulfilled: outcomes.filter((x) => x.status === "fulfilled").length,
    rejected: outcomes.filter((x) => x.status === "rejected").length,
  });
  assert.ok(outcomes.some((x) => x.status === "rejected"));
} finally {
  await pool.destroy();
}
