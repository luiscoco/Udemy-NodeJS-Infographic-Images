import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "lib"));
await fs.writeFile(
  join(lab.path, "lib/package.json"),
  '{"name":"course-local-lib","version":"1.0.0"}',
);
const manifest = {
  name: "course-lock-lab",
  version: "1.0.0",
  private: true,
  dependencies: { "course-local-lib": "file:./lib" },
};
await fs.writeFile(join(lab.path, "package.json"), JSON.stringify(manifest));
for (const command of ["install", "ci"]) {
  const r = await npm(
    [command, "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
    { cwd: lab.path },
  );
  assert.equal(r.code, 0, r.stderr);
  console.log(command, "succeeded");
}
manifest.dependencies.extra = "file:./lib";
await fs.writeFile(join(lab.path, "package.json"), JSON.stringify(manifest));
const mismatch = await npm(
  ["ci", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: lab.path },
);
assert.notEqual(mismatch.code, 0);
console.log("manifest/lock mismatch rejected");
