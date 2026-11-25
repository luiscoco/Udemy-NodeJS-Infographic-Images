import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { NDJSON } from "../../shared/ndjson.mjs";
import assert from "node:assert/strict";
const source = Buffer.from(
  '{"text":"café","level":"info"}\n{"level":"debug"}\n{"level":"info"}',
);
let output = "";
const transform = new NDJSON({ filter: (row) => row.level === "info" });
await pipeline(
  Readable.from(Array.from(source, (x) => Buffer.from([x]))),
  transform,
  new Writable({
    write(c, e, done) {
      output += c;
      done();
    },
  }),
);
console.log(output, transform.counts);
assert.equal(output.trim().split("\n").length, 2);
