import { assert, spawnNode } from "../../shared/lab.mjs";
const broken = await spawnNode(["a.mjs"]);
assert.notEqual(broken.code, 0);
console.log(
  "cycle rejected:",
  broken.stderr.split("\n").find((x) => x.includes("ReferenceError")),
);
const fixed = await import("./fixed-a.mjs");
console.log("acyclic:", fixed.value);
assert.equal(fixed.value, 2);
