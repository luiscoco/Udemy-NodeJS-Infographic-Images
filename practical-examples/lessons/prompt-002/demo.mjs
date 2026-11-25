import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [
  ["--eval", "2 + 3"],
  ["--print", "2 + 3"],
  ["--check", "main.mjs"],
  ["main.mjs"],
  ["--check", "bad.mjs"],
]) {
  const r = await spawnNode(args);
  console.log({ args, ...r });
  assert.equal(r.code, args.includes("bad.mjs") ? 1 : 0);
}
