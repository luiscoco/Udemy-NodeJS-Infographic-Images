import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "dist"));
await fs.writeFile(join(lab.path, "dist/generated.txt"), "generated");
const r = await spawnNode(["--check", "main.mjs"]);
assert.equal(r.code, 0);
await fs.rm(join(lab.path, "dist"), { recursive: true, force: true });
await assert.rejects(fs.access(join(lab.path, "dist")));
console.log("syntax checked; only owned generated dist removed");
