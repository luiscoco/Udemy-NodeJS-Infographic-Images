import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
import { fileURLToPath } from "node:url";
await using lab = await temp();
const input = join(lab.path, "input.ndjson"),
  output = join(lab.path, "filtered.ndjson");
await fs.writeFile(
  input,
  '{"level":"debug"}\n{"level":"info","text":"café 😀"}\nmalformed\n{"level":"error"}',
);
const main = fileURLToPath(
  new URL("../../applications/logtool/main.mjs", import.meta.url),
);
const success = await spawnNode([
  main,
  "--input",
  input,
  "--output",
  output,
  "--level",
  "info",
  "--malformed",
  "count",
]);
assert.equal(success.code, 0, success.stderr);
const summary = JSON.parse(success.stdout);
assert.equal(summary.accepted, 2);
assert.equal(summary.malformed, 1);
const before = await fs.readFile(output, "utf8");
const failure = await spawnNode([
  main,
  "--input",
  input,
  "--output",
  output,
  "--malformed",
  "fail",
]);
assert.equal(failure.code, 1);
assert.equal(await fs.readFile(output, "utf8"), before);
assert.equal(
  (await fs.readdir(lab.path)).filter((x) => x.endsWith(".tmp")).length,
  0,
);
console.log(
  success.stdout,
  before,
  "malformed failure preserved existing output and removed partial",
);
