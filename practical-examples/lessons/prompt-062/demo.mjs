import { createServer } from "node:http";
import { assert, listen, close, delay } from "../../shared/lab.mjs";
const server = createServer(async (q, s) => {
    if (q.url === "/slow") await delay(100);
    s.writeHead(q.url === "/missing" ? 404 : 200);
    s.end(q.url === "/bad" ? "{" : '{"ok":true}');
  }),
  base = await listen(server);
async function read(path, signal) {
  const r = await fetch(base + path, { signal });
  if (!r.ok) {
    await r.body?.cancel();
    throw Error("HTTP " + r.status);
  }
  return r.json();
}
try {
  console.log(await read("/data", AbortSignal.timeout(1000)));
  await assert.rejects(read("/missing"), /HTTP 404/);
  await assert.rejects(read("/bad"), SyntaxError);
  await assert.rejects(read("/slow", AbortSignal.timeout(10)));
  console.log("status, JSON and deadline errors observed");
} finally {
  await close(server);
}
