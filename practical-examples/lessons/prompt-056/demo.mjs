import { createReadStream } from "node:fs";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "fixture.bin");
await fs.writeFile(file, Buffer.alloc(10000));
const stream = createReadStream(file, { highWaterMark: 1024 });
let bytes = 0;
for await (const chunk of stream) {
  bytes += chunk.length;
  if (bytes >= 4096) break;
}
console.log({ bytes, destroyed: stream.destroyed });
assert.ok(bytes >= 4096);
assert.equal(stream.destroyed, true);
