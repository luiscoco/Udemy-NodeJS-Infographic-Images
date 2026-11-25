import { createServer } from "node:http";
export function buildServer() {
  const server = createServer(async (req, res) => {
    const send = (status, data) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
    };
    try {
      if (req.method === "GET" && req.url === "/health")
        return send(200, { ok: true });
      if (req.method !== "POST" || req.url !== "/echo")
        return send(404, { error: "Not found" });
      let size = 0,
        large = false,
        chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 1024) {
          large = true;
          chunks = [];
        } else if (!large) chunks.push(chunk);
      }
      if (large) return send(413, { error: "Too large" });
      try {
        send(200, JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        send(400, { error: "Invalid JSON" });
      }
    } catch {
      res.destroy();
    }
  });
  server.requestTimeout = 5000;
  server.headersTimeout = 5000;
  return server;
}
