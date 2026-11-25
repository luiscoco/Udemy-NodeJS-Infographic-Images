import { assert, fs, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
const build = await npm(["exec", "--", "tsc", "-p", "tsconfig.json"]);
assert.equal(build.code, 0, build.stdout + build.stderr);
const declaration = await fs.readFile("./dist/index.d.ts", "utf8");
assert.ok(declaration.includes("greet"));
const run = await spawnNode([
  "--input-type=module",
  "--eval",
  "import {greet} from './dist/index.js';console.log(greet('student'));",
]);
console.log(run.stdout, declaration);
assert.equal(run.stdout.trim(), "Hello, student");
