import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [
  ["--test", "--test-update-snapshots", "snapshot.test.mjs"],
  ["--test", "snapshot.test.mjs"],
]) {
  const r = await spawnNode(args);
  console.log(r.stdout);
  assert.equal(r.code, 0, r.stderr);
}
