import { assert, spawnNode } from "../../shared/lab.mjs";
for (const file of ["order.cjs", "order.mjs"]) {
  const r = await spawnNode([file]);
  console.log(file, r.stdout);
  assert.equal(r.code, 0);
}
