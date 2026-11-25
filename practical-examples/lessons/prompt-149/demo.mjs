import { assert, spawnNode } from "../../shared/lab.mjs";
const r = await spawnNode(["--experimental-bench", "--bench", "compare.mjs"]);
console.log(r.stdout, r.stderr);
assert.equal(r.code, 0, r.stderr);
