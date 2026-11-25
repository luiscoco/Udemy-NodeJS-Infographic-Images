import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
let addon;
try {
  addon = require("./build/Release/addon.node");
} catch (cause) {
  throw Error(
    "Build first: npm exec -- node-gyp rebuild --directory lessons/prompt-131",
    { cause },
  );
}
console.log(addon.twice(21));
assert.equal(addon.twice(21), 42);
assert.throws(() => addon.twice("21"), TypeError);
