import { parentPort, workerData } from "node:worker_threads";
let total = 0;
for (let i = 1; i <= workerData; i++) total += i;
parentPort.postMessage(total);
