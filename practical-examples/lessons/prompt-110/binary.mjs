export function encode(bytes) {
  const out = Buffer.alloc(4 + bytes.length);
  out.writeUInt32BE(bytes.length);
  out.set(bytes, 4);
  return out;
}
export function decode(bytes) {
  const b = Buffer.from(bytes);
  if (b.length < 4) throw Error("Truncated");
  const n = b.readUInt32BE();
  if (n > 1024 || b.length !== n + 4) throw Error("Invalid length");
  return Uint8Array.from(b.subarray(4));
}
