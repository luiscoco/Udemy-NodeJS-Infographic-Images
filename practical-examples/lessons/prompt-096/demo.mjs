import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
await using lab = await temp();
const path = join(lab.path, "secret.txt");
await fs.writeFile(path, "public-fixture-only");
for (const valid of [true, false]) {
  const env = { ...process.env, APP_SECRET: "", APP_SECRET_FILE: "" };
  delete env.APP_SECRET;
  if (valid) env.APP_SECRET_FILE = path;
  const r = await spawnNode(["config.mjs"], { env });
  console.log({ valid, code: r.code, stdout: r.stdout, stderr: r.stderr });
  assert.equal(r.code, valid ? 0 : 1);
  assert.ok(!r.stdout.includes("public-fixture-only"));
}
