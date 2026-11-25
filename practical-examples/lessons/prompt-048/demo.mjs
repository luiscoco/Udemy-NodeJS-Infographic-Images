import assert from "node:assert/strict";
const text = Buffer.from("hello");
const packet = Buffer.alloc(5 + text.length);
packet[0] = 1;
packet.writeUInt32BE(text.length, 1);
text.copy(packet, 5);
function decode(bytes) {
  if (bytes.length < 5) throw Error("Truncated header");
  const size = bytes.readUInt32BE(1);
  if (bytes[0] !== 1 || size > 1024 || bytes.length !== 5 + size)
    throw Error("Invalid record");
  return bytes.subarray(5).toString("utf8");
}
console.log(packet, decode(packet));
assert.throws(() => decode(packet.subarray(0, 4)));
assert.throws(() => decode(packet.subarray(0, 6)));
