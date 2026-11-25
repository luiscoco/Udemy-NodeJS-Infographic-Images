import { promisify } from "node:util";
import assert from "node:assert/strict";
function twice(n, cb) {
  queueMicrotask(() => {
    if (n < 0) return cb(Error("negative"));
    cb(null, n * 2);
  });
}
const run = promisify(twice);
console.log(await run(3));
await assert.rejects(run(-1), /negative/);
console.log("negative rejected");
