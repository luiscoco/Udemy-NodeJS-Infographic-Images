import vm from "node:vm";
import assert from "node:assert/strict";
const scope = { count: 1 };
vm.createContext(scope);
const script = new vm.Script("count+=2;count");
console.log(
  script.runInContext(scope, { timeout: 50 }),
  scope.count,
  globalThis.count,
);
assert.equal(scope.count, 3);
assert.equal(globalThis.count, undefined);
assert.throws(() =>
  new vm.Script("while(true){}").runInContext(scope, { timeout: 10 }),
);
console.log("synchronous execution timeout observed");
