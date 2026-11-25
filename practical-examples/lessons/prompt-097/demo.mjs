import { hashPassword, verifyPassword } from "../../shared/passwords.mjs";
import assert from "node:assert/strict";
const password = "public-fixture-password";
const first = await hashPassword(password),
  second = await hashPassword(password);
assert.notEqual(first, second);
assert.equal(await verifyPassword(password, first), true);
assert.equal(await verifyPassword("wrong-password", first), false);
assert.equal(await verifyPassword(password, "malformed"), false);
console.log("random salts differ; correct=true, wrong=false, malformed=false");
