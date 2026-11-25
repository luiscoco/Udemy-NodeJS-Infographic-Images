# Prompt 101: Webhook signatures and replay prevention

Category: Node.js core · Purpose: Verify message authenticity before processing side effects.
Implement webhook verification using crypto.createHmac over the original request bytes. Add timestamp and event-ID checks, and verify modified bodies, stale timestamps, and repeated events are rejected.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 101
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Raw-byte signature verification precedes parsing; a database transaction combines durable deduplication and the business update.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Webhook authentication covers the exact received bytes and timestamp. Parsing and re-serializing JSON before checking the HMAC can change those bytes and invalidate the sender's signature contract.

### Follow the implementation

From [demo.mjs, lines 13-27](demo.mjs#L13) (source excerpt; run the full application using the command above):

```javascript
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
```

From [demo.mjs, lines 31-48](demo.mjs#L31) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

The handler validates timestamp freshness and signature shape before constant-time comparison. After verification, a transaction combines a unique event identifier with the business update so replay does not repeat the effect.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change whitespace in the raw body while keeping the old signature, then submit the same valid event twice. Explain why signature validation and replay prevention are distinct checks.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-101.png)
- [Original lesson and curated constraints](lesson-brief.txt)
