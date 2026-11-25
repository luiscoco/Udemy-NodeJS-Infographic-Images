# Prompt 123: Load testing and bottlenecks

Category: Tooling · Purpose: Measure application behavior at realistic concurrency.
Load-test a PostgreSQL-backed endpoint using autocannon and pg. Report latency percentiles, throughput, and errors; inspect the query plan and verify the effect of a justified index.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 123
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual HTTP timings and EXPLAIN ANALYZE plans are measured before and after an index. The lab does not assume the index always wins.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Performance diagnosis combines end-to-end measurements with the database's actual execution plan. An index helps only when its access pattern matches the query and the planner chooses it.

### Follow the implementation

From [demo.mjs, lines 20-28](demo.mjs#L20) (source excerpt; run the full application using the command above):

```javascript
const query =
  "EXPLAIN (ANALYZE,BUFFERS) SELECT id,created_at FROM tasks WHERE owner_id='42' ORDER BY created_at DESC LIMIT 50";
try {
  for (const phase of ["baseline", "indexed"]) {
    if (phase === "indexed") {
      await db.pool.query("CREATE INDEX ON tasks(owner_id,created_at DESC)");
      await db.pool.query("ANALYZE tasks");
    }
    console.log(phase, (await db.pool.query(query)).rows);
```

From [demo.mjs, lines 29-48](demo.mjs#L29) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

The experiment records HTTP samples and EXPLAIN ANALYZE before and after a composite index plus ANALYZE. It measures outcomes instead of asserting a guaranteed speedup from one noisy run.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the query ordering and compare the chosen plan. Explain why an index on unrelated columns or order may not remove the expensive work.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-123.png)
- [Original lesson and curated constraints](lesson-brief.txt)
