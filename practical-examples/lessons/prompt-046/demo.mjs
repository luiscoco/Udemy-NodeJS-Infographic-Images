import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { randomUUID } from "node:crypto";
await using lab = await temp();
const file = join(lab.path, "record.txt");
await fs.writeFile(file, "old");
async function replace(text, fail = false) {
  const partial = file + "." + randomUUID() + ".tmp";
  try {
    await fs.writeFile(partial, text, { flag: "wx" });
    if (fail) throw Error("injected failure");
    await fs.rename(partial, file);
  } finally {
    await fs.rm(partial, { force: true });
  }
}
await assert.rejects(replace("incomplete", true));
assert.equal(await fs.readFile(file, "utf8"), "old");
await replace("new");
console.log(await fs.readFile(file, "utf8"), await fs.readdir(lab.path));
