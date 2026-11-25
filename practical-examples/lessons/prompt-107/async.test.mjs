import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { listen, close, temp, fs, join } from "../../shared/lab.mjs";
test("HTTP fixture owns resources", async (t) => {
  await using lab = await temp();
  await fs.writeFile(join(lab.path, "record"), "fixture");
  const server = createServer((q, s) => s.end("ok"));
  const base = await listen(server);
  t.after(() => close(server));
  assert.equal(await (await fetch(base)).text(), "ok");
});
