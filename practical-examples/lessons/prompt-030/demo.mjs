import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const a = require("./state.cjs"),
  b = require("./state.cjs");
console.log(a === b, a.next(), b.next());
assert.equal(a, b);
