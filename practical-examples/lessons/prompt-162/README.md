# Prompt 162: SQLite Backup & Advanced Statements

Back up an embedded SQLite database, reopen the copy read-only, iterate restored rows, and preserve a 64-bit integer beyond JavaScript's safe Number range. Use a unique disposable lab directory and verify the copy rather than assuming backup success.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 162
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

9007199254740993 safe

## Walkthrough and experiments

node:sqlite is Stability 1.2 Release candidate; do not label it fully stable. Database is the current class name on Node 26.13.1. Statements execute synchronously: iteration avoids all() materializing every row, but it does not make queries asynchronous. Use a BigInt literal before binding and setReadBigInts(true) before reading; converting a rounded Number to BigInt cannot recover lost precision. backup() returns a Promise and needs an open source; it overwrites an existing destination. This lab chooses a fresh destination in a disposable folder; dispose statements and databases before removing that folder. The copy is intentionally deleted on scope exit: durable backup retention is a separate task. Complete the exercise: read-only writes fail, compare counts/IDs and verify a retained copy after restart. Essential output only; warnings may also appear.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-162.png)
- [Original lesson and curated constraints](lesson-brief.txt)

The practical application also enables BigInt results on the INSERT statement: run() returns lastInsertRowid, which otherwise overflows Number for this fixture. Enabling it only on the SELECT is insufficient.
