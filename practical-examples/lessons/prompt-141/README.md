# Prompt 141: Deployment and rollback

Category: Tooling · Purpose: Release changes while preserving a recovery path.
Build a local deployment rehearsal with two application versions and a backward-compatible PostgreSQL migration. Verify both versions work during transition and demonstrate rollback without reversing an unsafe data transformation.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 141
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Mixed versions read the old authoritative field. After old writers drain, a catch-up backfill repairs even non-null stale derived values.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A rolling migration must tolerate old and new application versions at the same time. An additive column permits overlap, but old writers can leave its derived value stale.

### Follow the implementation

From [demo.mjs, lines 1-32](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
const {
  rows: [task],
} = await db.pool.query(
  "INSERT INTO tasks(title) VALUES('original') RETURNING id",
);
await db.pool.query("ALTER TABLE tasks ADD COLUMN display_title TEXT");
await db.pool.query("UPDATE tasks SET title=$1,display_title=$1 WHERE id=$2", [
  "v2 writes both",
  task.id,
]);
await db.pool.query("UPDATE tasks SET title=$1 WHERE id=$2", [
  "v1 old writer",
  task.id,
]);
let row = (
  await db.pool.query("SELECT title,display_title FROM tasks WHERE id=$1", [
    task.id,
  ])
).rows[0];
assert.notEqual(row.title, row.display_title);
console.log("During overlap read authoritative title:", row.title);
await db.pool.query("UPDATE tasks SET display_title=title");
row = (
  await db.pool.query("SELECT title,display_title FROM tasks WHERE id=$1", [
    task.id,
  ])
).rows[0];
assert.equal(row.title, row.display_title);
console.log("After old writers drained, final catch-up backfill:", row);
```

### Why this produces the observed result

The demo deliberately creates a non-null stale display_title. After old writers drain, the catch-up copies all authoritative title values; filling only nulls would miss this stale row.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the final backfill to update only null values and observe the failed equality. Explain when reads can safely switch to the new field and when old code could still be rolled back.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The final catch-up intentionally copies ALL authoritative title values, rather than only NULL values: a v1 writer can leave a non-null display_title stale. Keep additive columns throughout the rollback window; contract in a later release.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-141.png)
- [Original lesson and curated constraints](lesson-brief.txt)
