import { EventEmitter, once } from "node:events";
import assert from "node:assert/strict";
const events = new EventEmitter({ captureRejections: true });
const observed = new Promise((resolve) => events.once("error", resolve));
events.on("job", async () => {
  throw Error("job failed");
});
const returned = events.emit("job");
assert.equal(returned, true);
console.log("emit returns boolean, not the listener promise:", returned);
const error = await observed;
console.log("observed:", error.message);
assert.equal(error.message, "job failed");
