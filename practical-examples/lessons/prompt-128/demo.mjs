import { assert, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
const run = await spawnNode(["native.ts"]);
console.log("runtime:", run.stdout);
assert.equal(run.stdout.trim(), "42");
const check = await npm([
  "exec",
  "--",
  "tsc",
  "--noEmit",
  "--skipLibCheck",
  "--target",
  "ES2022",
  "native.ts",
]);
console.log("checker:", check.stdout);
assert.notEqual(check.code, 0);
