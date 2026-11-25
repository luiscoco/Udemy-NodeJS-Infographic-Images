import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const manifest = JSON.parse(
  await readFile(new URL("./fixture-package.json", import.meta.url)),
);
for (const kind of [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
])
  console.log(kind, manifest[kind]);
try {
  await import("course-not-installed-optional-fixture");
} catch (e) {
  assert.equal(e.code, "ERR_MODULE_NOT_FOUND");
  console.log("optional feature unavailable; baseline app continues");
}
console.log(
  "engines declares compatibility, not runtime installation:",
  manifest.engines,
);
