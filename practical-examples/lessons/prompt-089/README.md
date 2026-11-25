# Prompt 89: Concurrent updates

Category: Ecosystem · Purpose: Prevent one request from silently overwriting another.
Implement optimistic concurrency using pg, PostgreSQL, and a version column. Submit competing updates with the same version and verify exactly one succeeds while the other receives a conflict.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 089
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two concurrent updates using the same expected version produce one success and one conflict.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Optimistic concurrency compares the version a caller read with the version currently stored. The update increments the version only when both ID and expected version match.

### Follow the implementation

From [demo.mjs, lines 1-20](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using lab = await pgLab();
const {
  rows: [task],
} = await lab.pool.query(
  "INSERT INTO tasks(title) VALUES('original') RETURNING *",
);
const results = await Promise.all(
  ["edit A", "edit B"].map((title) =>
    lab.pool.query(
      "UPDATE tasks SET title=$1,version=version+1 WHERE id=$2 AND version=$3 RETURNING *",
      [title, task.id, task.version],
    ),
  ),
);
console.log(
  results.map((x) => ({ status: x.rowCount ? 200 : 409, rows: x.rows })),
);
assert.deepEqual(results.map((x) => x.rowCount).sort(), [0, 1]);
```

### Why this produces the observed result

Two concurrent edits use the same initial version, so only one row update succeeds. A zero rowCount is interpreted as a conflict rather than silently overwriting the winning edit.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Read the winning row's new version and submit another update using it. Explain why a fresh version can succeed while replaying the original version cannot.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-089.png)
- [Original lesson and curated constraints](lesson-brief.txt)
