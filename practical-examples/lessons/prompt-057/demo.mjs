import { createServer } from "node:http";
import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { assert, fs, temp, join, listen, close } from "../../shared/lab.mjs";
await using lab = await temp();
const bytes = Buffer.from("Web Streams -> Node streams");
const server = createServer((q, s) => s.end(bytes));
const base = await listen(server);
const part = join(lab.path, "download.part"),
  target = join(lab.path, "download.txt");
try {
  const response = await fetch(base, { signal: AbortSignal.timeout(1000) });
  if (!response.ok || !response.body) throw Error("Download failed");
  await pipeline(Readable.fromWeb(response.body), createWriteStream(part));
  await fs.rename(part, target);
  assert.deepEqual(await fs.readFile(target), bytes);
  console.log("byte-identical download published");
} finally {
  await fs.rm(part, { force: true });
  await close(server);
}
