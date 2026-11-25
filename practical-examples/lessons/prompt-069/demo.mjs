import { assert, spawnNode } from "../../shared/lab.mjs";
const payload = "hello; & echo data";
const r = await spawnNode(["helper.mjs", payload], { timeout: 1000 });
console.log(r);
assert.equal(r.code, 0);
assert.equal(r.stdout.trim(), payload);
