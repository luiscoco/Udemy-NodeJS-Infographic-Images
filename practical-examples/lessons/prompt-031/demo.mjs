import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
console.log(require("./helper.cjs").answer);
const esm = await import("./helper.mjs");
console.log(esm.answer);
assert.throws(() => require("./helper.mjs"), {
  code: "ERR_REQUIRE_ASYNC_MODULE",
});
console.log("async ESM requires dynamic import");
