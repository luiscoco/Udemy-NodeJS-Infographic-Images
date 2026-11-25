# Prompt 86: PostgreSQL and connection pooling

Category: Ecosystem · Purpose: Access a relational database with controlled connection usage.
Build parameterized CRUD operations using pg and a local PostgreSQL service. Configure a bounded pool, test injection-like input as ordinary data, and verify connections are released after errors.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 086
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The parameterized attack-shaped title is stored as ordinary data and the table remains intact.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

PostgreSQL parameter binding separates SQL structure from data. The attack-shaped title is passed as `$1`, so its punctuation is stored as a string rather than executed as SQL.

### Follow the implementation

From [demo.mjs, lines 1-14](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using lab = await pgLab();
const title = "x'; DROP TABLE tasks; --";
await lab.pool.query("INSERT INTO tasks(title) VALUES($1)", [title]);
const rows = (
  await lab.pool.query("SELECT id,title FROM tasks WHERE title=$1", [title])
).rows;
console.log(rows);
assert.equal(rows[0].title, title);
assert.equal(
  (await lab.pool.query("SELECT count(*) FROM tasks")).rows[0].count,
  "1",
);
```

### Why this produces the observed result

The pool manages reusable database connections. The lab owns a unique schema and disposes it after the assertion, so the test checks a real database without sharing lesson tables.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the title to include quotes and semicolons. Verify the exact value round-trips and the table still exists; explain why concatenating it into SQL would change that result.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-086.png)
- [Original lesson and curated constraints](lesson-brief.txt)
