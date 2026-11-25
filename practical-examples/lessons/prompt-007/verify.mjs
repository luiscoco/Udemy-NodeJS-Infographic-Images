import { spawn } from "node:child_process";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
await fs.copyFile(
  new URL("./main.mjs", import.meta.url),
  join(lab.path, "main.mjs"),
);
await fs.writeFile(
  join(lab.path, "message.mjs"),
  "export const message='Hello watch fixture';",
);
const child = spawn(process.execPath, ["--watch", "main.mjs"], {
  cwd: lab.path,
  stdio: ["ignore", "pipe", "pipe"],
});
const closed = new Promise((resolve) => child.once("close", resolve));
let output = "",
  changed = false;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("Watch restart deadline")),
      10000,
    );
    child.once("error", reject);
    child.stdout.on("data", (chunk) => {
      output += chunk;
      if (output.includes("Hello watch fixture") && !changed) {
        changed = true;
        fs.writeFile(
          join(lab.path, "message.mjs"),
          "export const message='Updated watch fixture';",
        ).catch(reject);
      }
      if (output.includes("Updated watch fixture")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.stderr.on("data", (chunk) => (output += chunk));
  });
  assert.ok(changed);
  console.log(output);
  console.log("actual imported-file edit triggered restart");
} finally {
  child.kill();
  await closed;
}
