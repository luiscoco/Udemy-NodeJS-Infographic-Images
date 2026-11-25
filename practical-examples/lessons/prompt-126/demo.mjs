import { breaker } from "../../shared/reliability.mjs";
import assert from "node:assert/strict";
let now = 1,
  calls = 0,
  healthy = false;
const call = breaker(
  async () => {
    calls++;
    if (!healthy) throw Error("dependency down");
    return "healthy";
  },
  () => now,
);
for (let i = 0; i < 3; i++) await assert.rejects(call(), /down/);
await assert.rejects(call(), /OPEN/);
assert.equal(calls, 3);
now += 1001;
healthy = true;
assert.equal(await call(), "healthy");
assert.equal(await call(), "healthy");
console.log({ calls, recovered: true });
