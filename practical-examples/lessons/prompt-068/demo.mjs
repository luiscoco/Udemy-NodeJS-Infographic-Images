import { assert, spawnNode } from "../../shared/lab.mjs";
const r = await spawnNode(["lifecycle.mjs"]);
console.log(r.stdout);
assert.equal(r.code, 0);
assert.equal(
  r.stdout
    .trim()
    .split("\n")
    .filter((x) => x === "cleaned up").length,
  1,
);
