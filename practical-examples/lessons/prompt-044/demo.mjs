import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { resolve, relative, isAbsolute, sep } from "node:path";
await using lab = await temp();
const root = join(lab.path, "root");
await fs.mkdir(root);
await fs.writeFile(join(root, "allowed.txt"), "allowed");
await fs.writeFile(join(lab.path, "outside.txt"), "outside");
async function inside(input) {
  if (isAbsolute(input)) throw Error("Absolute path rejected");
  const base = await fs.realpath(root),
    target = await fs.realpath(resolve(base, input)),
    rel = relative(base, target);
  if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel))
    throw Error("Outside root");
  return target;
}
console.log(await inside("allowed.txt"));
await assert.rejects(inside("../outside.txt"), /Outside/);
await assert.rejects(inside(join(root, "allowed.txt")), /Absolute/);
await assert.rejects(inside("missing"), { code: "ENOENT" });
console.log("traversal, absolute path and missing file checks passed");
