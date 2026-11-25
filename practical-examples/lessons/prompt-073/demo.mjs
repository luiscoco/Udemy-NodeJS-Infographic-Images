import { MessageChannel } from "node:worker_threads";
import assert from "node:assert/strict";
const { port1, port2 } = new MessageChannel(),
  buffer = new ArrayBuffer(1024 * 1024);
const received = new Promise((r) => port2.once("message", r));
port1.postMessage(buffer, [buffer]);
console.log("sender:", buffer.byteLength);
assert.equal(buffer.byteLength, 0);
const value = await received;
console.log("received:", value.byteLength);
assert.equal(value.byteLength, 1048576);
port1.close();
port2.close();
