import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { pgLab, transaction } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
const key = randomBytes(32),
  timestamp = String(Math.floor(Date.now() / 1000)),
  raw = Buffer.from(JSON.stringify({ id: "event-1", amount: 10 }));
const sign = (body) =>
  createHmac("sha256", key)
    .update(timestamp + ".")
    .update(body)
    .digest("hex");
function verify(body, time, signature) {
  if (
    !/^\d+$/.test(time) ||
    !/^[0-9a-f]{64}$/i.test(signature) ||
    Math.abs(Date.now() / 1000 - Number(time)) > 300
  )
    return false;
  return timingSafeEqual(
    createHmac("sha256", key)
      .update(time + ".")
      .update(body)
      .digest(),
    Buffer.from(signature, "hex"),
  );
}
const signature = sign(raw);
assert.equal(verify(Buffer.from("{}"), timestamp, signature), false);
assert.equal(verify(raw, "1", signature), false);
async function apply() {
  assert.ok(verify(raw, timestamp, signature));
  const event = JSON.parse(raw);
  return transaction(db.pool, async (client) => {
    const inserted = await client.query(
      "INSERT INTO processed_events VALUES($1) ON CONFLICT DO NOTHING RETURNING id",
      [event.id],
    );
    if (inserted.rowCount)
      await client.query("UPDATE accounts SET balance=balance+$1 WHERE id=1", [
        event.amount,
      ]);
    return inserted.rowCount;
  });
}
assert.equal(await apply(), 1);
assert.equal(await apply(), 0);
assert.equal(
  (await db.pool.query("SELECT balance FROM accounts WHERE id=1")).rows[0]
    .balance,
  110,
);
console.log(
  "tamper/stale rejected; repeated signed event has one durable effect",
);
