import { Readable, Transform } from "node:stream";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const partial = join(lab.path, "output.part"),
  target = join(lab.path, "output.txt");
try {
  await pipeline(
    Readable.from(["one", "two"]),
    new Transform({
      transform(c, e, done) {
        done(Error("injected transform failure"));
      },
    }),
    createWriteStream(partial),
  );
  await fs.rename(partial, target);
} catch (e) {
  await fs.rm(partial, { force: true });
  console.log(e.message);
}
await assert.rejects(fs.access(partial));
await assert.rejects(fs.access(target));
console.log("no partial or published output");
