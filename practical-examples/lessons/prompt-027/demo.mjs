import assert from "node:assert/strict";
async function read() {
  throw Error("disk unavailable");
}
async function service() {
  try {
    return await read();
  } catch (cause) {
    throw Error("Load failed", { cause });
  } finally {
    console.log("cleanup");
  }
}
try {
  await service();
  assert.fail();
} catch (e) {
  console.log(e.message, e.cause.message);
  assert.equal(e.cause.message, "disk unavailable");
}
