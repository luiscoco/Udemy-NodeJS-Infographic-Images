import { retry } from "../../shared/reliability.mjs";
import assert from "node:assert/strict";
let calls = 0;
const controller = new AbortController();
const answer = await retry(
  async () => {
    if (++calls < 3)
      throw Object.assign(Error("transient"), { retryable: true });
    return 42;
  },
  controller.signal,
  { rng: () => 0 },
);
assert.equal(answer, 42);
assert.equal(calls, 3);
let permanent = 0;
await assert.rejects(
  retry(async () => {
    permanent++;
    throw Error("permanent");
  }, controller.signal),
);
assert.equal(permanent, 1);
controller.abort();
await assert.rejects(
  retry(async () => {
    throw Error("must not call");
  }, controller.signal),
);
console.log({ answer, calls, permanent, cancelled: true });
