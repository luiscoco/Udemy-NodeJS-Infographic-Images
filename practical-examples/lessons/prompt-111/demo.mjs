import { assert, spawnNode } from "../../shared/lab.mjs";
for (const file of ["baseline.test.mjs", "complete.test.mjs"]) {
  const r = await spawnNode(["--test", "--experimental-test-coverage", file]);
  console.log(file, r.stdout);
  assert.equal(r.code, 0, r.stderr);
}
