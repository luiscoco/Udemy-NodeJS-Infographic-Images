import { assert, spawnNode } from "../../shared/lab.mjs";
for (const [file, flags, expected] of [
  ["iter.mjs", ["--experimental-stream-iter"], "HELLO, ITERABLE STREAMS"],
  ["classic.mjs", [], "HELLO, CLASSIC STREAMS"],
]) {
  const r = await spawnNode([...flags, file]);
  console.log(r.stdout);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(r.stdout.trim(), expected);
}
