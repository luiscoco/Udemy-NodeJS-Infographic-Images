import { createWriteStream } from "node:fs";
import { once } from "node:events";
import { finished } from "node:stream/promises";
const mib = Number(process.argv[2] ?? 8);
if (!Number.isInteger(mib) || mib < 1 || mib > 1024)
  throw Error("Choose 1..1024 MiB");
const stream = createWriteStream(process.argv[3] ?? "fixture.ndjson", {
    flags: "wx",
  }),
  line = JSON.stringify({ level: "info", message: "course fixture" }) + "\n";
let bytes = 0,
  records = 0;
while (bytes < mib * 1024 * 1024) {
  if (!stream.write(line)) await once(stream, "drain");
  bytes += Buffer.byteLength(line);
  records++;
}
stream.end();
await finished(stream);
console.log({ bytes, records });
