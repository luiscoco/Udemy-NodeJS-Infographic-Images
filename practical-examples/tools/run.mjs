import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
const root = new URL("../", import.meta.url);
const catalog = JSON.parse(
  await readFile(new URL("catalog.json", root), "utf8"),
);
const requested = process.argv[2];
if (!requested || requested === "--list") {
  for (const item of catalog)
    console.log(
      `${String(item.number).padStart(3, "0")}  ${item.title} [${item.mode}]`,
    );
} else {
  const item = catalog.find((x) => x.number === Number(requested));
  if (!item) {
    console.error("Unknown lesson number");
    process.exitCode = 2;
  } else {
    const child = spawn(
      process.execPath,
      [...item.flags, item.entry, ...item.args, ...process.argv.slice(3)],
      {
        cwd: fileURLToPath(new URL(item.folder + "/", root)),
        stdio: "inherit",
        shell: false,
      },
    );
    child.on("error", (e) => {
      console.error(e.message);
      process.exitCode = 1;
    });
    child.on("exit", (code, signal) => {
      process.exitCode = code ?? (signal ? 1 : 0);
    });
  }
}
