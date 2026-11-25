import { availableParallelism } from "node:os";

const availableMiB = Math.floor(process.availableMemory() / 2 ** 20);
const reserveMiB = 128;
const estimatedWorkerMiB = 64;
const cpuSlots = Math.max(1, availableParallelism() - 1);
const memorySlots = Math.floor(
  Math.max(0, availableMiB - reserveMiB) / estimatedWorkerMiB,
);
const workers = Math.min(4, cpuSlots, memorySlots);

console.log({
  availableMiB,
  constrainedBytes: process.constrainedMemory(),
  workers,
});
