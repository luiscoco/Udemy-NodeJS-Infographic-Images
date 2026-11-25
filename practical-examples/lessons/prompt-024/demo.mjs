import { assert, delay } from "../../shared/lab.mjs";
async function a() {
  await delay(40);
  return 2;
}
async function b() {
  await delay(40);
  return 3;
}
let start = performance.now();
const x = await a(),
  y = await b();
console.log("sequential measured ms", performance.now() - start, x + y);
start = performance.now();
const values = await Promise.all([a(), b()]);
console.log(
  "concurrent measured ms",
  performance.now() - start,
  values[0] + values[1],
);
assert.equal(values[0] + values[1], 5);
