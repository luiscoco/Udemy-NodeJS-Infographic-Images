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

## Walkthrough and experiments

For CLI practice set DATABASE_URL to a disposable DB and run npm exec node-pg-migrate -- up --migrations-dir lessons/prompt-088/migrations from the workspace. Never roll back a production table for a classroom exercise.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-088.png)
- [Original lesson and curated constraints](lesson-brief.txt)
