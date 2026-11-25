import test from "node:test";
import assert from "node:assert/strict";
import { admission, breaker, retry } from "../shared/reliability.mjs";
test("admission rejects overflow and releases failed slots", async () => {
  const gate = admission({ maxActive: 1, maxQueued: 1 });
  let release;
  const first = gate.submit(() => new Promise((r) => (release = r))),
    second = gate.submit(async () => {
      throw Error("fixture");
    });
  const rejection = assert.rejects(second, /fixture/);
  await assert.rejects(
    gate.submit(async () => {}),
    /OVERLOADED/,
  );
  release();
  await first;
  await rejection;
  assert.equal(gate.stats().active, 0);
});
test("half-open breaker admits a single probe", async () => {
  let now = 1,
    release;
  const call = breaker(
    async (wait) => {
      if (wait) return new Promise((r) => (release = r));
      throw Error("down");
    },
    () => now,
  );
  for (let i = 0; i < 3; i++) await assert.rejects(call(false));
  now += 1001;
  const probe = call(true);
  await assert.rejects(call(true), /OPEN/);
  release("up");
  assert.equal(await probe, "up");
});
test("retry never calls an operation after pre-cancellation", async () => {
  const controller = new AbortController();
  controller.abort();
  let calls = 0;
  await assert.rejects(retry(async () => calls++, controller.signal));
  assert.equal(calls, 0);
});
