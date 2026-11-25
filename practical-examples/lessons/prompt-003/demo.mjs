import { assert, spawnNode } from "../../shared/lab.mjs";
const run = await spawnNode(["src/add.js"]);
console.log(run.stdout.trim());
assert.equal(run.stdout.trim(), "5");
const tests = await spawnNode(["--test", "test/add.test.js"]);
console.log(tests.stdout);
assert.equal(tests.code, 0);
