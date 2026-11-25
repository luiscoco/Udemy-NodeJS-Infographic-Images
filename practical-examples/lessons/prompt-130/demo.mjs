import { assert, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
for (const file of ["bad.js", "fixed.js"]) {
  const run = await spawnNode([file]);
  console.log(file, "runtime", run.stdout.trim());
  const check = await npm([
    "exec",
    "--",
    "tsc",
    "--allowJs",
    "--checkJs",
    "--noEmit",
    "--skipLibCheck",
    "--module",
    "NodeNext",
    "--target",
    "ES2022",
    file,
  ]);
  console.log(check.stdout);
  if (file === "fixed.js")
    assert.equal(check.code, 0, check.stdout + check.stderr);
  else {
    assert.notEqual(check.code, 0);
    assert.ok(check.stdout.includes("TS2345"));
  }
}
