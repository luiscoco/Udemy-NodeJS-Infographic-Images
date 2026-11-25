import fc from "fast-check";
import assert from "node:assert/strict";
import { encode, decode } from "./binary.mjs";
fc.assert(
  fc.property(fc.uint8Array({ maxLength: 1024 }), (bytes) => {
    assert.deepEqual(decode(encode(bytes)), bytes);
  }),
  { numRuns: 1000, seed: 42 },
);
assert.throws(() => decode(Uint8Array.of(0, 0, 0)));
console.log("1000 seeded round trips plus truncated-header boundary passed");
