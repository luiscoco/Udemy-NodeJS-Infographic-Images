import { AsyncLocalStorage } from "node:async_hooks";
import { assert, delay } from "../../shared/lab.mjs";
const context = new AsyncLocalStorage(),
  seen = [];
async function request(id, ms) {
  return context.run({ id }, async () => {
    await Promise.resolve();
    await delay(ms);
    seen.push(context.getStore().id);
  });
}
await Promise.all([request("A", 20), request("B", 5)]);
console.log(seen, context.getStore());
assert.deepEqual(seen, ["B", "A"]);
assert.equal(context.getStore(), undefined);
