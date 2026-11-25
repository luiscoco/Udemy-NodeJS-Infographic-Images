import { fork } from "node:child_process";
import assert from "node:assert/strict";
const child = fork(new URL("./child.mjs", import.meta.url), {
  stdio: ["ignore", "inherit", "inherit", "ipc"],
});
const pending = new Map();
function rejectAll(error) {
  for (const item of pending.values()) {
    clearTimeout(item.timer);
    item.reject(error);
  }
  pending.clear();
}
child.on("error", rejectAll);
child.on("exit", () => rejectAll(Error("Child exited")));
child.on("message", (m) => {
  const item = pending.get(m.id);
  if (item) {
    clearTimeout(item.timer);
    pending.delete(m.id);
    item.resolve(m.value);
  }
});
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error("Child startup deadline")), 5000);
  function ready(m) {
    if (m.type === "ready") {
      clearTimeout(timer);
      child.off("message", ready);
      resolve();
    }
  }
  child.on("message", ready);
  child.once("error", (e) => {
    clearTimeout(timer);
    reject(e);
  });
});
let id = 0;
function rpc(type, value, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const key = String(++id),
      timer = setTimeout(() => {
        pending.delete(key);
        reject(Error("Deadline"));
      }, timeout);
    pending.set(key, { resolve, reject, timer });
    child.send({ id: key, type, value }, (error) => {
      if (error) {
        clearTimeout(timer);
        pending.delete(key);
        reject(error);
      }
    });
  });
}
try {
  assert.equal(await rpc("double", 21), 42);
  await assert.rejects(rpc("ignore", 0, 50), /Deadline/);
  console.log(
    "reply=42; ignored request deadline removed pending entry:",
    pending.size,
  );
  assert.equal(pending.size, 0);
} finally {
  const exited = new Promise((r) => child.once("exit", r));
  if (child.connected) child.disconnect();
  await exited;
}
