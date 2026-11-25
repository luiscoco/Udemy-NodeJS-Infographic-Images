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

## Walkthrough and experiments

node:sqlite is Stability 1.2 Release candidate. Flow: matching schemas -> attach session -> mutate source -> capture binary changeset -> apply on target -> handle conflicts. Session tracks changes after attachment; it does not create the target schema or automatically synchronize continuously. The first apply succeeds; repeating the INSERT conflicts on the primary key, so the explicit abort handler rolls back the apply and returns false. Default conflict policy also aborts. OMIT skips conflicts; REPLACE is valid only for DATA or CONFLICT conflict kinds, not every conflict. Changesets are binary Uint8Array data, not SQL migrations or a distributed replication protocol. using disposes count statement, session and databases in reverse order. Complete the exercise: update/delete conflicts, policy tests and explicit transport/authentication requirements. Essential output only; warnings may appear.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-163.png)
- [Original lesson and curated constraints](lesson-brief.txt)
