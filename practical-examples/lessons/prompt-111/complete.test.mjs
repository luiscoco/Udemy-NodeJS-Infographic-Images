import test from "node:test";
import assert from "node:assert/strict";
import { discount } from "./discount.mjs";
test("all behaviors", () => {
  assert.equal(discount(100, true), 90);
  assert.equal(discount(100, false), 100);
  assert.throws(() => discount(-1, true), /Invalid total/);
});
