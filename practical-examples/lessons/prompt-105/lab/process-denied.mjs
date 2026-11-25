import { spawn } from "node:child_process";
try {
  const child = spawn(process.execPath, ["--print", "1"]);
  child.on("error", (error) => {
    console.error(error.code);
    process.exitCode = 1;
  });
} catch (error) {
  console.error(error.code);
  process.exitCode = 1;
}
