import { assert, spawnNode, fs } from "../../shared/lab.mjs";
for (const shard of ["1/2", "2/2"]) {
  const r = await spawnNode([
    "--test",
    "--test-shard=" + shard,
    "a.test.mjs",
    "b.test.mjs",
  ]);
  console.log(shard, r.stdout);
  assert.equal(r.code, 0, r.stderr);
}
const junit = await spawnNode([
  "--test",
  "--test-concurrency=2",
  "--test-reporter=junit",
  "--test-reporter-destination=results.xml",
  "a.test.mjs",
  "b.test.mjs",
]);
assert.equal(junit.code, 0, junit.stderr);
assert.ok((await fs.readFile("./results.xml", "utf8")).includes("<testsuites"));
console.log("JUnit artifact written; both shards passed");
