import { dlopen, suffix } from "node:ffi";
import assert from "node:assert/strict";
const { lib, functions } = dlopen(`./mylib.${suffix}`, {
  add_i32: { arguments: ["int32", "int32"], return: "int32" },
});
try {
  const result = functions.add_i32(20, 22);
  console.log(result);
  assert.equal(result, 42);
} finally {
  lib.close();
}
