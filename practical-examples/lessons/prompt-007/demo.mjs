import { spawn } from "node:child_process";
const child = spawn(process.execPath, ["--watch", "main.mjs"], {
  stdio: "inherit",
});
child.on("exit", (code) => (process.exitCode = code ?? 0));
