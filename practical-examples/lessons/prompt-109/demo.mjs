import { assert, spawnNode } from "../../shared/lab.mjs";
const r = await spawnNode(["--test", "timers.test.mjs"]);
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
