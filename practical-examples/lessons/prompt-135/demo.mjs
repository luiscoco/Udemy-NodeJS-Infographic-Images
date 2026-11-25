import { assert, spawnNode } from "../../shared/lab.mjs";
const legacy = await spawnNode([
  "--pending-deprecation",
  "--trace-deprecation",
  "legacy.mjs",
]);
console.log(
  "legacy stdout:",
  legacy.stdout,
  "legacy diagnostics:",
  legacy.stderr,
);
const modern = await spawnNode(["modern.mjs"]);
console.log("modern:", modern.stdout);
assert.equal(modern.code, 0, modern.stderr);
assert.equal(modern.stdout.trim(), "hello");
