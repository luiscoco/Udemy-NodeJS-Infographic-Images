import Fastify from "fastify";
import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
await db.pool.query(
  "INSERT INTO tasks(title,owner_id,created_at) SELECT 'task '||i,(i%100)::text,now()-i*interval '1 second' FROM generate_series(1,10000)i",
);
const app = Fastify();
app.get(
  "/tasks",
  async () =>
    (
      await db.pool.query(
        "SELECT id,created_at FROM tasks WHERE owner_id=$1 ORDER BY created_at DESC LIMIT 50",
        ["42"],
      )
    ).rows,
);
await app.listen({ port: 0, host: "127.0.0.1" });
const query =
  "EXPLAIN (ANALYZE,BUFFERS) SELECT id,created_at FROM tasks WHERE owner_id='42' ORDER BY created_at DESC LIMIT 50";
try {
  for (const phase of ["baseline", "indexed"]) {
    if (phase === "indexed") {
      await db.pool.query("CREATE INDEX ON tasks(owner_id,created_at DESC)");
      await db.pool.query("ANALYZE tasks");
    }
    console.log(phase, (await db.pool.query(query)).rows);
    const samples = [];
    for (let wave = 0; wave < 5; wave++)
      await Promise.all(
        Array.from({ length: 10 }, async () => {
          const start = performance.now(),
            r = await fetch(
              "http://127.0.0.1:" + app.server.address().port + "/tasks",
            );
          assert.equal(r.status, 200);
          await r.json();
          samples.push(performance.now() - start);
        }),
      );
    samples.sort((a, b) => a - b);
    console.log({
      phase,
      requests: samples.length,
      p50ms: samples[Math.floor(samples.length * 0.5)],
      p95ms: samples[Math.floor(samples.length * 0.95)],
    });
  }
} finally {
  await app.close();
}
