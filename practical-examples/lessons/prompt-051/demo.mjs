import { EventEmitter } from "node:events";
import assert from "node:assert/strict";
const job = new EventEmitter(),
  seen = [];
const progress = (n) => seen.push(n);
job.on("error", (e) => seen.push(e.message));
job.on("progress", progress);
job.once("done", () => seen.push("complete"));
job.emit("progress", 50);
job.emit("done");
job.emit("done");
job.off("progress", progress);
assert.equal(job.listenerCount("progress"), 0);
console.log(seen);
assert.deepEqual(seen, [50, "complete"]);
