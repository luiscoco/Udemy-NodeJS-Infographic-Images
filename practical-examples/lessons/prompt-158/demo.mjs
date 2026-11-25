import { createServer } from "node:http";
import { assert, listen, close, spawnNode } from "../../shared/lab.mjs";
const server = createServer((q, s) => s.end("ok")),
  base = await listen(server);
try {
  const r = await spawnNode(["fetch-pool.mjs"], {
    env: { ...process.env, HEALTH_URL: base + "/health" },
  });
  console.log(r.stdout);
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(r.stdout.trim().split("\n"), ["ok", "ok"]);
} finally {
  await close(server);
}
