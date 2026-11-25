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

## Walkthrough and experiments

The Docker container supplies pg_dump/pg_restore, avoiding a required host CLI installation. Only this generated restore database and this lesson’s private schema are removed.

## Requirements and validation

Execution mode: **docker+postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-142.png)
- [Original lesson and curated constraints](lesson-brief.txt)
