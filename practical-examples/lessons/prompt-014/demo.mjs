import assert from "node:assert/strict";
const valid = (s) =>
  /^[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*$/u.test(s.normalize("NFC"));
const a = "café",
  b = "cafe\u0301",
  face = "😀";
console.log(a === b, a.normalize("NFC") === b.normalize("NFC"));
console.log(face.length, [...face].length, Buffer.byteLength(face));
console.log(valid("café"), valid("😀"));
assert.equal(a.normalize("NFC"), b.normalize("NFC"));
