import assert from "node:assert/strict";
let requested = 0,
  cleaned = false;
async function* pages() {
  try {
    for (let p = 1; p <= 5; p++) {
      requested++;
      yield [p * 10];
    }
  } finally {
    cleaned = true;
    console.log("cleanup");
  }
}
for await (const page of pages()) {
  console.log(page);
  break;
}
console.log({ requested, cleaned });
assert.equal(requested, 1);
assert.equal(cleaned, true);
