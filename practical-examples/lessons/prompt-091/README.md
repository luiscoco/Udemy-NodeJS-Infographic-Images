# Prompt 91: Redis caching

Category: Ecosystem · Purpose: Reduce repeated work while managing stale data.
Implement cache-aside reads using the redis package and a local Redis service. Add TTLs and write invalidation, then verify cache misses, stale-entry removal, and a defined cache-outage fallback.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 091
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Miss loads DB, hit avoids it, commit-plus-invalidation refreshes it, and a closed cache falls back to PostgreSQL.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Cache-aside reads try Redis first and load PostgreSQL on a miss. A TTL limits retention, and a committed database update is followed by invalidation so a later read can refresh.

### Follow the implementation

From [demo.mjs, lines 1-36](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { pgLab } from "../../shared/postgres.mjs";
import { redisLab } from "../../shared/redis.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
await using redis = await redisLab();
const {
  rows: [task],
} = await db.pool.query("INSERT INTO tasks(title) VALUES('first') RETURNING *");
const key = redis.prefix + "task:" + task.id;
let loads = 0;
async function load() {
  try {
    const hit = await redis.client.get(key);
    if (hit !== null) return JSON.parse(hit);
  } catch {}
  loads++;
  const value = (
    await db.pool.query("SELECT * FROM tasks WHERE id=$1", [task.id])
  ).rows[0];
  try {
    await redis.client.set(key, JSON.stringify(value), { EX: 30 });
  } catch {}
  return value;
}
await load();
await load();
assert.equal(loads, 1);
await db.pool.query("UPDATE tasks SET title=$1 WHERE id=$2", [
  "changed",
  task.id,
]);
await redis.client.del(key);
assert.equal((await load()).title, "changed");
await redis.client.quit();
assert.equal((await load()).title, "changed");
console.log({ databaseLoads: loads, cacheFailureFallback: true });
```

### Why this produces the observed result

The cache is an optimization, so Redis failures fall back to the authoritative database. The lesson demonstrates sequential invalidation; concurrent stale-fill races need additional coordination in a larger design.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the stored task, skip invalidation once, and observe the stale hit. Restore invalidation and explain why deleting cache data before the database update commits would be risky.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-091.png)
- [Original lesson and curated constraints](lesson-brief.txt)
