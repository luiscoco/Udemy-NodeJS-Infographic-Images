import { assert, fs, spawnNode } from "../../shared/lab.mjs";
await fs.mkdir("./.compile-cache", { recursive: true });
for (const phase of ["cold", "warm", "disabled"]) {
  const start = performance.now();
  const env = { ...process.env };
  if (phase === "disabled") env.NODE_DISABLE_COMPILE_CACHE = "1";
  const r = await spawnNode(["cache.mjs"], { env });
  console.log({
    phase,
    elapsedMs: performance.now() - start,
    output: r.stdout,
  });
  assert.equal(r.code, 0, r.stderr);
  assert.ok(r.stdout.includes("42"));
}
