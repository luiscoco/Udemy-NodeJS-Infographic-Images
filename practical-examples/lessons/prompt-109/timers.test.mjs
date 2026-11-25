import test from "node:test";
import assert from "node:assert/strict";
test("deadline boundaries", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const call = t.mock.fn();
  setTimeout(call, 100);
  t.mock.timers.tick(99);
  assert.equal(call.mock.callCount(), 0);
  t.mock.timers.tick(1);
  assert.equal(call.mock.callCount(), 1);
});
