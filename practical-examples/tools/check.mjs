import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const root = new URL("../", import.meta.url),
  catalog = JSON.parse(await readFile(new URL("catalog.json", root), "utf8"));
assert.equal(catalog.length, 167);
assert.deepEqual(
  catalog.map((x) => x.number),
  Array.from({ length: 167 }, (_, i) => i + 1),
);
const files = [];
async function walk(relative) {
  for (const entry of await readdir(new URL(relative, root), {
    withFileTypes: true,
  })) {
    if (
      [
        "node_modules",
        "dist",
        "build",
        "profiles",
        "reports",
        ".compile-cache",
        "__pycache__",
      ].includes(entry.name)
    )
      continue;
    const path = relative + entry.name;
    if (entry.isDirectory()) await walk(path + "/");
    else if (
      /\.(mjs|cjs|js)$/.test(entry.name) &&
      path !== "lessons/prompt-002/bad.mjs"
    )
      files.push(path);
  }
}
for (const name of ["lessons/", "shared/", "applications/", "tools/", "test/"])
  await walk(name);
let index = 0;
const failures = [];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (index < files.length) {
      const file = files[index++];
      const result = await new Promise((resolve) => {
        const child = spawn(
          process.execPath,
          ["--check", fileURLToPath(new URL(file, root))],
          { stdio: ["ignore", "pipe", "pipe"] },
        );
        let error = "";
        child.stderr.on("data", (x) => (error += x));
        child.on("close", (code) => resolve({ code, error }));
      });
      if (result.code) failures.push({ file, ...result });
    }
  }),
);
if (failures.length) {
  console.error(failures);
  process.exitCode = 1;
} else
  console.log(
    `Catalog: 167 consecutive lessons; syntax: ${files.length} application/source files passed. Intentional invalid parser fixture excluded.`,
  );
