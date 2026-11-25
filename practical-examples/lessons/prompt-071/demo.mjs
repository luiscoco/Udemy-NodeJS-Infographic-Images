import { Worker } from "node:worker_threads";
import assert from "node:assert/strict";
const worker = new Worker(new URL("./worker.mjs", import.meta.url), {
  workerData: 100000,
});
const answer = await new Promise((resolve, reject) => {
  worker.once("message", resolve);
  worker.once("error", reject);
});
console.log(answer);
assert.equal(answer, 5000050000);
await new Promise((resolve, reject) =>
  worker.once("exit", (code) =>
    code ? reject(Error("Worker failed")) : resolve(),
  ),
);
