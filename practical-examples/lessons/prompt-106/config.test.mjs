import test from "node:test";
import assert from "node:assert/strict";
import { port } from "./config.mjs";
test("port boundaries", () => {
  assert.equal(port("3000"), 3000);
  assert.equal(port(1), 1);
  assert.equal(port(65535), 65535);
  for (const input of [0, -1, 65536, "abc", ""])
    assert.throws(() => port(input), /Invalid port/);
});
