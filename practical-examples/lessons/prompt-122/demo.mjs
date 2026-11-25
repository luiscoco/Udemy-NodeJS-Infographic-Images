import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [[], ["--leak"]]) {
  const r = await spawnNode(["--expose-gc", "cache.mjs", ...args]);
  console.log(args.length ? "unbounded" : "bounded", r.stdout);
  assert.equal(r.code, 0, r.stderr);
  const rows = r.stdout.trim().split("\n").map(JSON.parse);
  assert.equal(rows.at(-1).size, args.length ? 80000 : 1000);
}
