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
