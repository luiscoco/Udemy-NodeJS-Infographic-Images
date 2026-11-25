import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const html = await readFile(new URL("./public/index.html", import.meta.url));
createServer((q, s) => {
  s.setHeader("content-type", "text/html");
  s.end(html);
}).listen(5173, "127.0.0.1");
