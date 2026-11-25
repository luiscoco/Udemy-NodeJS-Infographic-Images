# Prompt 88: Schema migrations

Category: Ecosystem · Purpose: Evolve database structure reproducibly.
Use node-pg-migrate with PostgreSQL to create and evolve a task schema. Verify migration from an empty database and an existing dataset, documenting rollback limitations when data could be lost.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 088
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A migration is applied transactionally and its default preserves compatibility. A complete node-pg-migrate file is also supplied.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A migration changes database structure in a controlled, recorded sequence. Adding a column with a compatible default allows existing insert code to keep working during a transition.

### Follow the implementation

From [demo.mjs, lines 9-20](demo.mjs#L9) (source excerpt; run the full application using the command above):

```javascript
await transaction(lab.pool, async (client) => {
  await client.query(
    "ALTER TABLE tasks ADD COLUMN priority INTEGER NOT NULL DEFAULT 0",
  );
  await client.query("INSERT INTO migration_versions VALUES(1)");
});
await lab.pool.query("INSERT INTO tasks(title) VALUES('persisted fixture')");
assert.equal(
  (await lab.pool.query("SELECT priority FROM tasks")).rows[0].priority,
  0,
);
console.log("additive migration applied; existing/default data verified");
```

From [demo.mjs, lines 22-33](demo.mjs#L22) (source excerpt; run the full application using the command above):

```javascript
await runner({
  databaseUrl: process.env.DATABASE_URL,
  schema: lab.schema,
  migrationsSchema: lab.schema,
  migrationsTable: "cli_versions",
  dir: fileURLToPath(new URL("./migrations/*.cjs", import.meta.url))
    .split(String.fromCharCode(92))
    .join("/"),
  useGlob: true,
  direction: "up",
  log: () => {},
});
```

### Why this produces the observed result

The first transaction records its version with the schema change. The real node-pg-migrate runner then discovers and applies the supplied migration in the isolated schema; filenames alone do not apply changes.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the new default and inspect an inserted row. Explain why dropping a column that an old application still reads is a different compatibility risk from adding a defaulted one.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

For CLI practice set DATABASE_URL to a disposable DB and run npm exec node-pg-migrate -- up --migrations-dir lessons/prompt-088/migrations from the workspace. Never roll back a production table for a classroom exercise.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-088.png)
- [Original lesson and curated constraints](lesson-brief.txt)
