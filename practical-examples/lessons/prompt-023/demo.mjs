import assert from "node:assert/strict";
const work = () => [
  Promise.resolve("A"),
  Promise.reject(Error("B failed")),
  Promise.resolve("C"),
];
try {
  await Promise.all(work());
} catch (e) {
  console.log("all:", e.message);
}
console.log((await Promise.allSettled(work())).map((x) => x.status));
console.log(await Promise.any(work()));
await assert.rejects(Promise.any([Promise.reject(Error("x"))]), AggregateError);
