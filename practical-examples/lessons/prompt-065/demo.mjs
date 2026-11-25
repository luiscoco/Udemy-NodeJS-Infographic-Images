import { createServer, connect } from "node:net";
import { assert, listen, close } from "../../shared/lab.mjs";
function frame(text) {
  const payload = Buffer.from(text),
    out = Buffer.alloc(4 + payload.length);
  out.writeUInt32BE(payload.length);
  payload.copy(out, 4);
  return out;
}
function parser(onMessage) {
  let pending = Buffer.alloc(0);
  return (chunk) => {
    if (pending.length + chunk.length > 131080) throw Error("Buffer budget");
    pending = Buffer.concat([pending, chunk]);
    while (pending.length >= 4) {
      const n = pending.readUInt32BE();
      if (n > 65536) throw Error("Frame too large");
      if (pending.length < n + 4) return;
      onMessage(pending.subarray(4, 4 + n).toString());
      pending = pending.subarray(4 + n);
    }
  };
}
const input = Buffer.concat([frame("one"), frame("two")]);
for (let i = 0; i <= input.length; i++) {
  const values = [],
    push = parser((x) => values.push(x));
  push(input.subarray(0, i));
  push(input.subarray(i));
  assert.deepEqual(values, ["one", "two"]);
}
const server = createServer((socket) => {
  socket.on("error", () => {});
  const push = parser((x) => socket.write(x + "\n"));
  socket.on("data", (chunk) => {
    try {
      push(chunk);
    } catch (e) {
      socket.destroy(e);
    }
  });
});
await listen(server);
try {
  const text = await new Promise((resolve, reject) => {
    const socket = connect(server.address().port, "127.0.0.1");
    let data = "";
    socket.on("error", reject);
    socket.on("data", (c) => (data += c));
    socket.on("end", () => resolve(data));
    socket.on("connect", () => {
      socket.write(input.subarray(0, 1));
      socket.end(input.subarray(1));
    });
  });
  console.log(text);
  assert.equal(text, "one\ntwo\n");
} finally {
  await close(server);
}
