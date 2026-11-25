import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "secret.txt");
const handle = await fs.open(file, "wx", 0o600);
try {
  await handle.writeFile("public fixture only");
} finally {
  await handle.close();
}
await assert.rejects(fs.open(file, "wx", 0o600), { code: "EEXIST" });
console.log("EEXIST; original fixture intact");
