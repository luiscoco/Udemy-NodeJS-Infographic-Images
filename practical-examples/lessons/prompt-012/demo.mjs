import assert from "node:assert/strict";
let produced = 0,
  cleaned = false;
function* range(n) {
  try {
    for (let i = 0; i < n; i++) {
      produced++;
      yield i;
    }
  } finally {
    cleaned = true;
  }
}
const first = [];
for (const n of range(1_000_000)) {
  first.push(n);
  if (first.length === 10) break;
}
console.log({ first, produced, cleaned });
assert.equal(produced, 10);
assert.equal(cleaned, true);
