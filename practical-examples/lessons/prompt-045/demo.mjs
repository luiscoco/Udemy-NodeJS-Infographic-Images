import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "nested"));
await fs.writeFile(join(lab.path, "a.txt"), "a");
await fs.writeFile(join(lab.path, "nested/b.txt"), "b");
async function* walk(dir) {
  for await (const entry of await fs.opendir(dir)) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}
const files = [];
for await (const path of walk(lab.path)) files.push(path);
console.log(files);
assert.equal(files.length, 2);
