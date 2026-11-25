import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";
import {
  createGzip,
  createGunzip,
  createBrotliCompress,
  createBrotliDecompress,
} from "node:zlib";
import { createHash } from "node:crypto";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const bytes = Buffer.from("caf? ?? streaming fixture\n".repeat(1000)),
  input = join(lab.path, "input.txt");
await fs.writeFile(input, bytes);
const digest = (data) => createHash("sha256").update(data).digest("hex");
for (const [name, zip, unzip] of [
  ["gzip", createGzip, createGunzip],
  ["brotli", createBrotliCompress, createBrotliDecompress],
]) {
  const packed = join(lab.path, name),
    target = join(lab.path, name + ".restored"),
    partial = target + ".part";
  await pipeline(
    createReadStream(input, { highWaterMark: 128 }),
    zip(),
    createWriteStream(packed),
  );
  async function restore(limit) {
    let count = 0;
    try {
      await pipeline(
        createReadStream(packed),
        unzip(),
        new Transform({
          transform(chunk, encoding, done) {
            count += chunk.length;
            done(
              count > limit ? Error("Decompressed budget exceeded") : null,
              chunk,
            );
          },
        }),
        createWriteStream(partial),
      );
      await fs.rename(partial, target);
    } finally {
      await fs.rm(partial, { force: true });
    }
  }
  await restore(bytes.length);
  assert.equal(digest(await fs.readFile(target)), digest(bytes));
  await assert.rejects(restore(32), /budget/);
  assert.equal(digest(await fs.readFile(target)), digest(bytes));
  console.log({
    codec: name,
    sourceBytes: bytes.length,
    compressedBytes: (await fs.stat(packed)).size,
    checksumVerified: true,
    oversizedRestoreRejected: true,
  });
}
