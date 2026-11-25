import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
const upper = new Transform({
  transform(c, e, done) {
    done(null, c.toString().toUpperCase());
  },
});
await pipeline(
  Readable.from(["hello, classic streams"]),
  upper,
  process.stdout,
);
