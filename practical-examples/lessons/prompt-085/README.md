# Prompt 85: Embedded SQLite — experimental

Category: Node.js core · Purpose: Explore a database without a separate server.
Build a local notes CLI using the experimental node:sqlite module and its current Database class. Use prepared statements, verify persistence after restart, and measure the effect of synchronous queries on an active timer.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 085
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Reopening the real SQLite file preserves the first record; each execution inserts another record. Database operations remain synchronous.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

SQLite stores relational data in a file without a separate database server. Prepared statements bind values separately from SQL and can be reused for inserts and reads.

### Follow the implementation

From [demo.mjs, lines 1-20](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Database } from "node:sqlite";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "notes.db");
for (let pass = 1; pass <= 2; pass++) {
  const db = new Database(file);
  try {
    db.exec(
      "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY,text TEXT NOT NULL)",
    );
    using insert = db.prepare("INSERT INTO notes(text) VALUES (?)");
    insert.run("Learn Node.js");
    using read = db.prepare("SELECT * FROM notes ORDER BY id");
    const rows = read.all();
    console.log(rows);
    assert.equal(rows.length, pass);
  } finally {
    db.close();
  }
}
```

### Why this produces the observed result

Opening the same temporary file twice preserves the first insertion, while each pass adds one row. These database calls are synchronous, so large queries still occupy the JavaScript thread.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a second field and bind its value. Reopen the file again and predict the row count, then explain why deleting the file would change the persistence result.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-085.png)
- [Original lesson and curated constraints](lesson-brief.txt)
