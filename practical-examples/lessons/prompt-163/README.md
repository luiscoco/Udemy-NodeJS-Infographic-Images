# Prompt 163: SQLite Sessions & Changesets

Capture changes to a SQLite table and apply them to another database with the same schema. Reapply the changeset to trigger a conflict, demonstrate an explicit abort policy, and verify no duplicate row is created.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 163
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

true
false
1

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A SQLite session captures row changes that can be applied to another compatible database. Applying the same changes again can create a primary-key conflict rather than an automatic idempotent no-op.

### Follow the implementation

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { Database, constants } from "node:sqlite";

using source = new Database(":memory:");
using target = new Database(":memory:");
for (const db of [source, target]) {
  db.exec("CREATE TABLE notes(id INTEGER PRIMARY KEY, body TEXT)");
}
using session = source.createSession({ table: "notes" });
source.exec("INSERT INTO notes VALUES (1, 'hello')");
const changes = session.changeset();

console.log(target.applyChangeset(changes));
console.log(
  target.applyChangeset(changes, {
    onConflict: () => constants.SQLITE_CHANGESET_ABORT,
  }),
);
using count = target.prepare("SELECT count(*) AS n FROM notes");
console.log(count.get().n);
```

### Why this produces the observed result

The first apply succeeds, and the second uses an explicit conflict callback that aborts. The final count proves that the rejected replay did not add another row.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the conflict policy only after identifying the conflicting row. Explain why session changesets are not a substitute for schema migration or a universal conflict-free replication system.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

node:sqlite is Stability 1.2 Release candidate. Flow: matching schemas -> attach session -> mutate source -> capture binary changeset -> apply on target -> handle conflicts. Session tracks changes after attachment; it does not create the target schema or automatically synchronize continuously. The first apply succeeds; repeating the INSERT conflicts on the primary key, so the explicit abort handler rolls back the apply and returns false. Default conflict policy also aborts. OMIT skips conflicts; REPLACE is valid only for DATA or CONFLICT conflict kinds, not every conflict. Changesets are binary Uint8Array data, not SQL migrations or a distributed replication protocol. using disposes count statement, session and databases in reverse order. Complete the exercise: update/delete conflicts, policy tests and explicit transport/authentication requirements. Essential output only; warnings may appear.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-163.png)
- [Original lesson and curated constraints](lesson-brief.txt)
