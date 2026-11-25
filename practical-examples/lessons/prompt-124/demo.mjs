import { admission } from "../../shared/reliability.mjs";
import { assert, delay } from "../../shared/lab.mjs";
const gate = admission();
const jobs = Array.from({ length: 40 }, () =>
  gate.submit(async () => {
    await delay(10);
    return "done";
  }),
);
await assert.rejects(
  gate.submit(async () => {}),
  /OVERLOADED/,
);
await Promise.all(jobs);
console.log(gate.stats());
assert.equal(gate.stats().maxActive, 8);
assert.equal(gate.stats().queued, 0);
