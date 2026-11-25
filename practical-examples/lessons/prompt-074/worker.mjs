import { workerData } from "node:worker_threads";
const view = new Int32Array(workerData);
for (let i = 0; i < 100000; i++) Atomics.add(view, 0, 1);
