import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [["--input", "demo"], ["--help"], ["--unknown"]]) {
  const r = await spawnNode(["cli.mjs", ...args]);
  console.log({ args, ...r });
  assert.equal(r.code, args.includes("--unknown") ? 1 : 0);
}
