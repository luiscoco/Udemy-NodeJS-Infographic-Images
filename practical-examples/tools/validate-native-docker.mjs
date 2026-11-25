import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
const run = promisify(execFile),
  root = fileURLToPath(new URL("../", import.meta.url));
const report = [];
for (const [number, command] of [
  [
    131,
    "node ../../node_modules/node-gyp/bin/node-gyp.js rebuild --nodedir=/usr/local && node demo.mjs",
  ],
  [147, "cc -shared -fPIC -o mylib.so add.c && node demo.mjs"],
]) {
  console.log(
    "Building and executing native lesson",
    number,
    "in Linux Docker",
  );
  let result;
  try {
    const { stdout, stderr } = await run(
      "docker",
      [
        "run",
        "--rm",
        "--volume",
        `${root}:/work`,
        "--workdir",
        `/work/lessons/prompt-${number}`,
        "node:26.13.1-bookworm",
        "sh",
        "-lc",
        command,
      ],
      { maxBuffer: 20 * 1024 * 1024, timeout: 900000 },
    );
    result = {
      number,
      status: "passed",
      runtime: "v26.13.1",
      platform: "linux (Docker)",
      stdout,
      stderr,
    };
  } catch (error) {
    result = {
      number,
      status: "failed",
      runtime: "v26.13.1",
      platform: "linux (Docker)",
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? error.message,
    };
  }
  report.push(result);
  console.log(number, result.status);
  await writeFile(
    new URL("validation/native-report.json", new URL("../", import.meta.url)),
    JSON.stringify({ lessons: report }, null, 2),
  );
}
if (report.some((x) => x.status === "failed")) process.exitCode = 1;
