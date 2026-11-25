import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "demo.txt");
await fs.writeFile(file, "Hello");
await fs.appendFile(file, ", Node.js!");
const handle = await fs.open(file, "r");
try {
  console.log(await handle.readFile("utf8"));
} finally {
  await handle.close();
}
await fs.rm(file);
await assert.rejects(fs.readFile(file), { code: "ENOENT" });
console.log("ENOENT after removal");
