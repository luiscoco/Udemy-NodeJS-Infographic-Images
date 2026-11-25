import { assert, spawnNode } from "../../shared/lab.mjs";
const yes = await spawnNode(["ask.mjs", "--yes"]);
const piped = await spawnNode(["ask.mjs"], { input: "y\n" });
console.log(yes, piped);
assert.equal(yes.code, 0);
assert.equal(piped.code, 1);
