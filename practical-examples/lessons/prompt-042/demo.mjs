import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "dist"));
await fs.writeFile(
  join(lab.path, "package.json"),
  JSON.stringify({
    name: "course-package-fixture",
    version: "1.0.0",
    type: "module",
    files: ["dist"],
    exports: "./dist/index.js",
  }),
);
await fs.writeFile(join(lab.path, "dist/index.js"), "export const answer=42;");
await fs.writeFile(
  join(lab.path, "secret-fixture.txt"),
  "PUBLIC TEST FIXTURE - MUST BE EXCLUDED",
);
const r = await npm(["pack", "--dry-run", "--json", "--ignore-scripts"], {
  cwd: lab.path,
});
assert.equal(r.code, 0, r.stderr);
const files = JSON.parse(r.stdout)[0].files.map((x) => x.path);
console.log(files);
assert.ok(files.includes("dist/index.js"));
assert.ok(!files.includes("secret-fixture.txt"));
console.log("allowlist verified; nothing published");
