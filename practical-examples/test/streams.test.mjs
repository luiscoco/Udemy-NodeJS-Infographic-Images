import test from "node:test";
import assert from "node:assert/strict";
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { NDJSON } from "../shared/ndjson.mjs";
async function run(chunks, options) {
  let output = "";
  const transform = new NDJSON(options);
  await pipeline(
    Readable.from(chunks),
    transform,
    new Writable({
      write(chunk, encoding, done) {
        output += chunk;
        done();
      },
    }),
  );
  return { output, counts: transform.counts };
}
test("every UTF-8 split and incomplete final line are preserved", async () => {
  const text = '{"level":"info","text":"café 😀"}',
    bytes = Buffer.from(text);
  for (let split = 0; split <= bytes.length; split++) {
    const result = await run([bytes.subarray(0, split), bytes.subarray(split)]);
    assert.equal(JSON.parse(result.output).text, "café 😀");
    assert.equal(result.counts.accepted, 1);
  }
});
test("empty, malformed and overlong record policies", async () => {
  assert.equal((await run([])).output, "");
  assert.equal(
    (await run(['bad\n{"ok":true}'], { malformed: "count" })).counts.malformed,
    1,
  );
  await assert.rejects(run(["bad"]), SyntaxError);
  await assert.rejects(
    run(["x".repeat(65)], { maxLength: 64 }),
    /Record too long/,
  );
});
