# Prompt 154: Background-Job Processing System

Category: EcosystemPurpose: Make asynchronous work recoverable under partial failure.
Learning goals: Durable queues, idempotency, scheduling, retries, bounded concurrency, transactional outbox, and failure inspection.
Implementation prompt:
Build a report-processing system using fastify, pg, and bullmq configured with Redis. Accept requests through an API, persist business state and an outbox entry transactionally, and process jobs with bounded retries and idempotent result publication. Include scheduling, progress reporting, and a script that interrupts workers at controlled points.
Acceptance criteria:
Killing a worker during processing permits recovery.
Repeating the same logical operation produces one durable business result.
Transient failures retry within a configured budget.
Permanent failures become visible after the attempt limit.
Worker concurrency stays within the configured bound.
Scheduling has explicit time-zone, overlap, and restart policies.
Queue delivery behavior and business-effect guarantees are explained separately.
Suggested point: After Module 16.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 154
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A separate worker process really exits after publishing its result but before ACK. Recovery retries the stalled job and the database proves one durable effect.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A worker can crash after committing its result but before acknowledging the queue job. Recovery may deliver that job again, so a durable business operation must tolerate repetition.

### Follow the implementation

From [../../shared/outbox.mjs, lines 15-29](../../shared/outbox.mjs#L15) (source excerpt; run the full application using the command above):

```javascript
export async function publishResult(pool, eventId, reportId) {
  return transaction(pool, async (client) => {
    const inserted = await client.query(
      "INSERT INTO processed_events(id) VALUES($1) ON CONFLICT DO NOTHING RETURNING id",
      [eventId],
    );
    if (inserted.rowCount)
      await client.query("UPDATE reports SET status=$1,result=$2 WHERE id=$3", [
        "complete",
        { total: 42 },
        reportId,
      ]);
    return inserted.rowCount;
  });
}
```

From [demo.mjs, lines 32-53](demo.mjs#L32) (source excerpt; run the full application using the command above):

```javascript
  assert.equal(await exited, 99);
  recovery = new Worker(
    name,
    (job) => publishResult(db.pool, job.data.reportId, job.data.reportId),
    {
      connection,
      lockDuration: 1000,
      stalledInterval: 500,
      maxStalledCount: 2,
    },
  );
  recovery.on("error", () => {});
  await job.waitUntilFinished(events, 15000);
  assert.equal(
    (await db.pool.query("SELECT count(*) FROM processed_events")).rows[0]
      .count,
    "1",
  );
  assert.equal(
    (await db.pool.query("SELECT status FROM reports")).rows[0].status,
    "complete",
  );
```

### Why this produces the observed result

The fixture kills a separate worker at that boundary, lets a recovery worker process the stalled job, and checks one processed-event row. Transactional deduplication establishes one effect despite at-least-once delivery.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect crash-worker.mjs and identify the commit-to-ACK window. Explain why removing the processed-events uniqueness guard could duplicate a real external effect.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-154.png)
- [Original lesson and curated constraints](lesson-brief.txt)
