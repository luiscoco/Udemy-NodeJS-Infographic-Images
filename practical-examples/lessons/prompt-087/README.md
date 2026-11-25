# Prompt 87: Transactions

Category: Ecosystem · Purpose: Preserve invariants across related database changes.
Implement a two-record transfer using pg and one checked-out PostgreSQL client. Inject failure between updates and verify rollback preserves the total and the client returns to the pool.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 087
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Failure between updates rolls back both balances; success preserves the total with deterministic lock ordering.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A transaction makes the debit and credit one database operation: either both commit or both roll back. The transaction helper uses one checked-out connection for BEGIN, all queries, and COMMIT or ROLLBACK.

### Follow the implementation

From [demo.mjs, lines 1-26](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { pgLab, transaction } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using lab = await pgLab();
async function transfer(fail) {
  return transaction(lab.pool, async (client) => {
    await client.query(
      "SELECT id FROM accounts WHERE id IN(1,2) ORDER BY id FOR UPDATE",
    );
    await client.query("UPDATE accounts SET balance=balance-10 WHERE id=1");
    if (fail) throw Error("injected failure");
    await client.query("UPDATE accounts SET balance=balance+10 WHERE id=2");
  });
}
await assert.rejects(transfer(true));
let rows = (await lab.pool.query("SELECT * FROM accounts ORDER BY id")).rows;
assert.deepEqual(
  rows.map((x) => x.balance),
  [100, 50],
);
await transfer(false);
rows = (await lab.pool.query("SELECT * FROM accounts ORDER BY id")).rows;
console.log(rows);
assert.deepEqual(
  rows.map((x) => x.balance),
  [90, 60],
);
```

### Why this produces the observed result

Locking both account rows in a deterministic order reduces deadlock opportunities. The injected failure checks unchanged balances before a successful transfer checks the preserved total.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Move the failure between the updates and compare balances. Explain why issuing BEGIN and each update through unrelated pool queries would not reliably create one transaction.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-087.png)
- [Original lesson and curated constraints](lesson-brief.txt)
