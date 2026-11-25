import { createServer } from "node:http";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = createServer((q, s) => {
  if (q.url === "/redirect") {
    s.writeHead(302, { location: "http://127.0.0.1:9/private" });
    s.end();
  } else s.end(q.url === "/large" ? "x".repeat(2048) : "allowed");
});
const base = await listen(server),
  destinations = new Map([
    ["docs", new URL(base)],
    ["redirect", new URL("/redirect", base)],
    ["large", new URL("/large", base)],
  ]);
async function download(name) {
  const url = destinations.get(name);
  if (!url) throw Error("Unknown destination");
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(1000),
  });
  let bytes = 0;
  try {
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > 1024) throw Error("Body too large");
    }
    return bytes;
  } finally {
    if (!response.body.locked) await response.body.cancel().catch(() => {});
  }
}
try {
  console.log("allowlisted bytes", await download("docs"));
  await assert.rejects(download("http://internal.invalid"), /Unknown/);
  await assert.rejects(download("redirect"));
  await assert.rejects(download("large"), /large/);
  console.log("unknown destination, redirect and body budget rejected");
} finally {
  await close(server);
}
