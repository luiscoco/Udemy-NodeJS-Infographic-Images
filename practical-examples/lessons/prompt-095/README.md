# Prompt 95: Transactional outbox

Category: Ecosystem · Purpose: Coordinate database changes with eventual message delivery.
Implement an outbox using pg, PostgreSQL, and bullmq with Redis. Commit business data and an outbox row together, crash the dispatcher at different points, and verify eventual processing with deduplicated business effects.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 095
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two deliveries produce one durable business effect, protected by a PostgreSQL uniqueness constraint and transaction.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A transactional outbox stores the business record and the event to publish in one database transaction. A relay can then retry delivery after a failure.

### Follow the implementation

From [../../shared/outbox.mjs, lines 1-29](../../shared/outbox.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { transaction } from "./postgres.mjs";
export async function createReport(pool, id, owner = "user-a") {
  return transaction(pool, async (client) => {
    const inserted = await client.query(
      "INSERT INTO reports(id,owner_id,status) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING RETURNING id",
      [id, owner, "pending"],
    );
    if (inserted.rowCount)
      await client.query(
        "INSERT INTO outbox(id,topic,payload) VALUES($1,$2,$3)",
        [id, "report.requested", { reportId: id }],
      );
  });
}
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

### Why this produces the observed result

The consumer writes a unique processed-event key in the same transaction as its business effect. Two different queue deliveries therefore produce one durable effect; queue delivery itself is not exactly once.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Deliver the same event with another job ID and inspect processed_events. Explain why a queue-level job ID alone would not replace durable consumer deduplication.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-095.png)
- [Original lesson and curated constraints](lesson-brief.txt)
