import { assert, spawnNode } from "../../shared/lab.mjs";
for (const version of ["broken", "fixed"]) {
  const r = await spawnNode(["--test", "discount.test.mjs"], {
    env: { ...process.env, DISCOUNT_VERSION: version },
  });
  console.log(version, r.stdout);
  assert.equal(r.code, version === "fixed" ? 0 : 1);
}
