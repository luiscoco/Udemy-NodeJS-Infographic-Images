import { execFileSync } from "node:child_process";
import { Pool } from "pg";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { pgLab } from "../../shared/postgres.mjs";
import { assert } from "../../shared/lab.mjs";
await using source = await pgLab();
const name = "restore_" + randomUUID().replaceAll("-", ""),
  url = new URL(process.env.DATABASE_URL),
  admin = new Pool({ connectionString: url.href, max: 1 });
let restored;
const compose = fileURLToPath(new URL("../../compose.yaml", import.meta.url)),
  env = fileURLToPath(new URL("../../.env", import.meta.url));
const docker = (args) =>
  execFileSync("docker", [
    "compose",
    "--env-file",
    env,
    "-f",
    compose,
    ...args,
  ]);
try {
  await source.pool.query("INSERT INTO tasks(title) VALUES('backup fixture')");
  await admin.query("CREATE DATABASE " + name);
  const archive = docker([
    "exec",
    "-T",
    "db",
    "pg_dump",
    "-U",
    "course",
    "-d",
    "course_lab",
    "--format=custom",
    "--schema=" + source.schema,
  ]);
  execFileSync(
    "docker",
    [
      "compose",
      "--env-file",
      env,
      "-f",
      compose,
      "exec",
      "-T",
      "db",
      "pg_restore",
      "-U",
      "course",
      "--dbname=" + name,
      "--exit-on-error",
      "--no-owner",
    ],
    { input: archive },
  );
  url.pathname = "/" + name;
  restored = new Pool({
    connectionString: url.href,
    options: "-c search_path=" + source.schema,
  });
  assert.equal(
    (await restored.query("SELECT title FROM tasks")).rows[0].title,
    "backup fixture",
  );
  console.log(
    "actual pg_dump archive restored into separate database; fixture verified",
  );
} finally {
  await restored?.end();
  await admin.query("DROP DATABASE IF EXISTS " + name);
  await admin.end();
}
