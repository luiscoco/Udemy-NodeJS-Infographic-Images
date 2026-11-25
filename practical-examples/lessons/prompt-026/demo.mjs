import { assert, delay } from "../../shared/lab.mjs";
const caller = new AbortController();
const combined = AbortSignal.any([caller.signal, AbortSignal.timeout(30)]);
try {
  await delay(500, null, { signal: combined });
  assert.fail();
} catch (e) {
  console.log({ thrown: e.name, reason: combined.reason.name });
  assert.equal(e.name, "AbortError");
  assert.equal(combined.reason.name, "TimeoutError");
}
