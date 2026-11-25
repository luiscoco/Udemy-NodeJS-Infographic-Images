import test from "node:test";
import assert from "node:assert/strict";
import { discount } from "./discount.mjs";
test("member total", () => assert.equal(discount(100, true), 90));
