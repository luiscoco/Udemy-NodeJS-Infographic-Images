import { createServer } from "node:http";
const server = createServer((q, s) => {
  s.setHeader("content-type", "application/json");
  s.end(JSON.stringify({ ok: true }));
});
server.listen(3000, "0.0.0.0");
process.on("SIGTERM", () => server.close());
