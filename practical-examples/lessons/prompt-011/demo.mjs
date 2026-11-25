import assert from "node:assert/strict";
const users = new Map([[7, { name: "Luis" }]]),
  meta = new WeakMap();
const user = users.get(7);
meta.set(user, { selected: true });
console.log(
  [...new Set([1, 1, 2])],
  user.name,
  meta.get(user),
  new Set([{}, {}]).size,
);
assert.equal(new Set([{}, {}]).size, 2);
