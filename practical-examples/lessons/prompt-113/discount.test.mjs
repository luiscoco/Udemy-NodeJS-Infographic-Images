import test from "node:test";
import assert from "node:assert/strict";
const { total } = await import(
  "./" + (process.env.DISCOUNT_VERSION ?? "fixed") + ".mjs"
);
test("20 percent discount", () => assert.equal(total(100, 20), 80));
