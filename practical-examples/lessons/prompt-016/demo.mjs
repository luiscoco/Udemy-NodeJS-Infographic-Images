import { createServer } from "node:http";
import { listen, close, delay } from "../../shared/lab.mjs";
const server = createServer(async (req, res) => {
  try {
    if (req.url === "/io") await delay(100);
    else {
      const end = performance.now() + 100;
      while (performance.now() < end) {}
    }
    res.end("done");
  } catch {
    res.writeHead(500);
    res.end();
  }
});
const base = await listen(server);
try {
  for (const route of ["/io", "/cpu"]) {
    const start = performance.now();
    await Promise.all([
      fetch(base + route).then((r) => r.text()),
      fetch(base + route).then((r) => r.text()),
    ]);
    console.log(route, Math.round(performance.now() - start), "measured ms");
  }
} finally {
  await close(server);
}
