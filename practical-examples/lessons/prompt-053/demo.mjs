import { Writable } from "node:stream";
import { once } from "node:events";
import { finished } from "node:stream/promises";
import assert from "node:assert/strict";
let bytes = 0,
  maxQueued = 0;
const slow = new Writable({
  highWaterMark: 4096,
  write(chunk, enc, done) {
    bytes += chunk.length;
    setTimeout(done, 1);
  },
});
for (let i = 0; i < 50; i++) {
  const accepted = slow.write(Buffer.alloc(1024));
  maxQueued = Math.max(maxQueued, slow.writableLength);
  if (!accepted) await once(slow, "drain");
}
slow.end();
await finished(slow);
console.log({ bytes, maxQueued });
assert.equal(bytes, 50 * 1024);
assert.ok(maxQueued <= 4096);
