import { StringDecoder } from "node:string_decoder";
import assert from "node:assert/strict";
const text = "café 😀",
  bytes = Buffer.from(text);
for (let i = 0; i <= bytes.length; i++) {
  const decoder = new StringDecoder("utf8");
  assert.equal(
    decoder.write(bytes.subarray(0, i)) + decoder.end(bytes.subarray(i)),
    text,
  );
}
console.log("All split points preserved:", bytes.length + 1);
