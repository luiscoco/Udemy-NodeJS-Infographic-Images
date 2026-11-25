# Prompt 142: Backup, restore, and maintenance

Category: Tooling · Purpose: Prove that recovery procedures work.
Create a PostgreSQL backup-and-restore drill using pg_dump and pg_restore. Verify restored records and constraints, and provide a Node.js patch-upgrade procedure that reruns the project’s checks before rollout.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 142
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real custom-format PostgreSQL archive restores into a fresh, separately named database and its fixture is checked before cleanup.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A backup is useful only if it can be restored and its contents verified. The lesson creates a custom-format PostgreSQL archive and restores it into a separately named database.

### Follow the implementation

From [demo.mjs, lines 24-37](demo.mjs#L24) (source excerpt; run the full application using the command above):

```javascript
  await source.pool.query("INSERT INTO tasks(title) VALUES('backup fixture')");
  await admin.query("CREATE DATABASE " + name);
  const archive = docker([
    "exec",
    "-T",
    "db",
    "pg_dump",
    "-U",
    "course",
    "-d",
    "course_lab",
    "--format=custom",
    "--schema=" + source.schema,
  ]);
```

From [demo.mjs, lines 56-74](demo.mjs#L56) (source excerpt; run the full application using the command above):

```javascript
    { input: archive },
  );
  url.pathname = "/" + name;
  restored = new Pool({
    connectionString: url.href,
    options: "-c search_path=" + source.schema,
  });
  assert.equal(
    (await restored.query("SELECT title FROM tasks")).rows[0].title,
    "backup fixture",
  );
  console.log(
    "actual pg_dump archive restored into separate database; fixture verified",
  );
} finally {
  await restored?.end();
  await admin.query("DROP DATABASE IF EXISTS " + name);
  await admin.end();
}
```

### Why this produces the observed result

The assertion reads the restored fixture rather than treating a successful dump command as recovery evidence. Cleanup is restricted to the database created by this rehearsal.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the dump, restore, and verification steps in order. Explain how restoring into a fresh destination avoids overwriting the source and what additional operational data a real recovery plan must cover.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The Docker container supplies pg_dump/pg_restore, avoiding a required host CLI installation. Only this generated restore database and this lesson’s private schema are removed.

## Requirements and validation

Execution mode: **docker+postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-142.png)
- [Original lesson and curated constraints](lesson-brief.txt)
