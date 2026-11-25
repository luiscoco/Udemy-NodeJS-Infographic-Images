import { createSocket } from "node:dgram";
import assert from "node:assert/strict";
const receiver = createSocket("udp4"),
  sender = createSocket("udp4"),
  seen = [];
let rejectReceive;
const done = new Promise((resolve, reject) => {
  rejectReceive = reject;
  receiver.on("error", reject);
  receiver.on("message", (data) => {
    seen.push(JSON.parse(data).seq);
    if (seen.length === 3) resolve();
  });
});
await new Promise((r) => receiver.bind(0, "127.0.0.1", r));
const timer = setTimeout(
  () => rejectReceive(Error("Datagram receive deadline")),
  2000,
);
try {
  for (const seq of [1, 3, 2])
    await new Promise((resolve, reject) =>
      sender.send(
        JSON.stringify({ seq }),
        receiver.address().port,
        "127.0.0.1",
        (e) => (e ? reject(e) : resolve()),
      ),
    );
  await done;
  const missing = [1, 2, 3, 4].filter((x) => !seen.includes(x));
  console.log({ observed: seen, missing });
  assert.deepEqual(missing, [4]);
} finally {
  clearTimeout(timer);
  sender.close();
  receiver.close();
}
