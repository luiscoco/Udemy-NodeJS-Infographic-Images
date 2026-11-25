import { Worker } from "node:worker_threads";
import assert from "node:assert/strict";
const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
await Promise.all(
  [1, 2].map(
    () =>
      new Promise((resolve, reject) => {
        const worker = new Worker(new URL("./worker.mjs", import.meta.url), {
          workerData: shared,
        });
        worker.on("error", reject);
        worker.on("exit", (code) =>
          code ? reject(Error("Worker failed")) : resolve(),
        );
      }),
  ),
);
console.log(Atomics.load(new Int32Array(shared), 0));
assert.equal(Atomics.load(new Int32Array(shared), 0), 200000);
