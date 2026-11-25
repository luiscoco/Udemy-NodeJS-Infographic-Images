import prettier from "prettier";
import { readdir, readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
let count = 0;
async function walk(relative) {
  for (const item of await readdir(new URL(relative, root), {
    withFileTypes: true,
  })) {
    if (
      [
        "node_modules",
        ".npm-cache",
        "dist",
        "build",
        "profiles",
        "reports",
        ".compile-cache",
        "__pycache__",
        "validation",
      ].includes(item.name)
    )
      continue;
    const path = relative + item.name;
    if (item.isDirectory()) await walk(path + "/");
    else if (
      /\.(mjs|cjs|js|ts|json|yaml|yml|md)$/.test(item.name) &&
      !path.endsWith("observed-output.txt") &&
      path !== "lessons/prompt-002/bad.mjs" &&
      item.name !== "package-lock.json"
    ) {
      const file = new URL(path, root),
        source = await readFile(file, "utf8");
      await writeFile(
        file,
        await prettier.format(source, { filepath: file.pathname }),
      );
      count++;
    }
  }
}
await walk("");
console.log("Formatted", count, "teaching/source files.");
