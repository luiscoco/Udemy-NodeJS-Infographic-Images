import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, delimiter } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
export { assert, fs, join, delay };
export async function temp() {
  const path = await fs.mkdtemp(join(tmpdir(), "node-course-"));
  return {
    path,
    async [Symbol.asyncDispose]() {
      await fs.rm(path, { recursive: true, force: true });
    },
  };
}
export async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}
export async function close(server) {
  server.closeIdleConnections?.();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
export function spawnNode(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      ...options,
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
      env: {
        ...(options.env ?? process.env),
        PATH:
          dirname(process.execPath) +
          delimiter +
          (options.env ?? process.env).PATH,
      },
    });
    let stdout = "",
      stderr = "";
    child.stdout.on("data", (x) => (stdout += x));
    child.stderr.on("data", (x) => (stderr += x));
    child.once("error", reject);
    child.once("close", (code, signal) =>
      resolve({ code, signal, stdout, stderr }),
    );
    child.stdin.end(options.input ?? "");
  });
}
export function result(label, value) {
  console.log(
    JSON.stringify({ check: label, value }, (_, x) =>
      typeof x === "bigint" ? x.toString() : x,
    ),
  );
}
