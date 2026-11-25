import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
await using lab = await temp();
const binary = join(
    lab.path,
    process.platform === "win32" ? "hello.exe" : "hello",
  ),
  config = join(lab.path, "sea.json");
await fs.writeFile(
  config,
  JSON.stringify({
    main: fileURLToPath(new URL("./hello.mjs", import.meta.url)),
    mainFormat: "module",
    output: binary,
  }),
);
const build = await spawnNode(["--build-sea", config]);
assert.equal(build.code, 0, build.stderr);
const run = await promisify(execFile)(binary, ["student"], {
  env: { ...process.env, PATH: "" },
});
console.log(run.stdout);
assert.equal(run.stdout.trim(), "Hello, student!");
