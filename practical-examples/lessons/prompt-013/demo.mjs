import assert from "node:assert/strict";
const row = {
  id: 9007199254740993n,
  createdAt: new Date("2026-01-01T00:00:00Z"),
};
assert.throws(() => JSON.stringify(row), TypeError);
const json = JSON.stringify({
  id: String(row.id),
  createdAt: row.createdAt.toISOString(),
});
const parsed = JSON.parse(json);
const restored = {
  id: BigInt(parsed.id),
  createdAt: new Date(parsed.createdAt),
};
console.log(json, restored.id === row.id);
assert.equal(restored.id, row.id);
