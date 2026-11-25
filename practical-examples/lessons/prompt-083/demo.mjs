import { createServer } from "node:http";
import { assert, listen, close, delay } from "../../shared/lab.mjs";
let active = 0;
const history = [
  { id: 1, data: { ok: true } },
  { id: 2, data: { step: "done" } },
];
const server = createServer((q, s) => {
  s.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
  });
  active++;
  const last = Number(q.headers["last-event-id"] ?? 0);
  for (const event of history.filter((x) => x.id > last))
    s.write(
      `id: ${event.id}\nevent: ready\ndata: ${JSON.stringify(event.data)}\n\n`,
    );
  const heartbeat = setInterval(() => s.write(": heartbeat\n\n"), 50);
  s.once("close", () => {
    clearInterval(heartbeat);
    active--;
  });
});
const base = await listen(server);
try {
  const response = await fetch(base, { headers: { "Last-Event-ID": "1" } });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  while (!text.includes("\n\n")) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    if (text.length > 4096) throw Error("SSE frame budget exceeded");
  }
  console.log(text);
  assert.ok(text.includes("id: 2"));
  assert.ok(!text.includes("id: 1"));
  await reader.cancel();
  for (let i = 0; active && i < 100; i++) await delay(5);
  assert.equal(active, 0);
} finally {
  await close(server);
}
