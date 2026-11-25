import assert from "node:assert/strict";
function counter() {
  let n = 0;
  return () => ++n;
}
const a = counter(),
  b = counter();
const values = [a(), a(), b()];
console.log(values);
assert.deepEqual(values, [1, 2, 1]);
const wrong = [],
  right = [];
for (var i = 0; i < 3; i++) wrong.push(() => i);
for (let j = 0; j < 3; j++) right.push(() => j);
console.log(
  wrong.map((f) => f()),
  right.map((f) => f()),
);
