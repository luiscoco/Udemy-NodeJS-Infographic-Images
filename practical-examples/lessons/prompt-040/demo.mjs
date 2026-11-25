import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
await using lab = await temp();
for (const name of ["math", "cli"])
  await fs.mkdir(join(lab.path, "packages", name), { recursive: true });
await fs.writeFile(
  join(lab.path, "package.json"),
  JSON.stringify({ private: true, workspaces: ["packages/*"] }),
);
await fs.writeFile(
  join(lab.path, "packages/math/package.json"),
  JSON.stringify({
    name: "@demo/math",
    version: "1.0.0",
    type: "module",
    exports: "./index.js",
  }),
);
await fs.writeFile(
  join(lab.path, "packages/math/index.js"),
  "export const add=(a,b)=>a+b;",
);
await fs.writeFile(
  join(lab.path, "packages/cli/package.json"),
  JSON.stringify({
    name: "@demo/cli",
    version: "1.0.0",
    type: "module",
    dependencies: { "@demo/math": "1.0.0" },
  }),
);
await fs.writeFile(
  join(lab.path, "packages/cli/main.mjs"),
  "import {add} from '@demo/math';console.log(add(2,3));",
);
const installed = await npm(
  ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: lab.path },
);
assert.equal(installed.code, 0, installed.stderr);
const r = await spawnNode(["packages/cli/main.mjs"], { cwd: lab.path });
console.log(r.stdout);
assert.equal(r.stdout.trim(), "5");
