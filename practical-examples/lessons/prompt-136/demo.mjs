import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const run = (args) => execFileSync("docker", args, { encoding: "utf8" }).trim();
run(["build", "-t", "node-course-prompt-136", "."]);
let id;
try {
  id = run([
    "run",
    "-d",
    "--rm",
    "--init",
    "-p",
    "127.0.0.1::3000",
    "node-course-prompt-136",
  ]);
  const port = run(["port", id, "3000/tcp"]).split(":").at(-1);
  let response;
  for (let i = 0; i < 50; i++) {
    try {
      response = await fetch("http://127.0.0.1:" + port);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  assert.equal((await response.json()).ok, true);
  console.log("non-root container replied on its assigned loopback port");
} finally {
  if (id) run(["stop", id]);
}
