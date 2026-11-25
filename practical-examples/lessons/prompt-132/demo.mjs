import wabtInit from "wabt";
import assert from "node:assert/strict";
const wabt = await wabtInit(),
  parsed = wabt.parseWat(
    "double.wat",
    '(module (func (export "double") (param i32) (result i32) local.get 0 i32.const 2 i32.mul))',
  );
const { buffer } = parsed.toBinary({});
parsed.destroy();
const { instance } = await WebAssembly.instantiate(buffer);
console.log(instance.exports.double(21), instance.exports.double(2147483647));
assert.equal(instance.exports.double(21), 42);
assert.equal(instance.exports.double(2147483647), -2);
