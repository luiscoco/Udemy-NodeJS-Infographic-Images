import { add } from "./math.js";
import assert from "node:assert/strict";
console.log(add(2, 3));
assert.equal(add(2, 3), 5);
await assert.rejects(import("./math"), { code: "ERR_MODULE_NOT_FOUND" });
console.log("extensionless import rejected");
