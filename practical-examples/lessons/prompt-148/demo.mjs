import vfs from "node:vfs";
import fs from "node:fs";
import assert from "node:assert/strict";
const fixture = vfs.create();
fixture.mkdirSync("/config", { recursive: true });
fixture.writeFileSync("/config/app.json", '{"mode":"test"}');
const root = fixture.mount();
try {
  console.log(fs.readFileSync(`${root}/config/app.json`, "utf8"));
} finally {
  fixture.unmount();
}
assert.equal(fixture.mounted, false);
const provider = new vfs.MemoryProvider(),
  locked = vfs.create(provider);
locked.writeFileSync("/seed.txt", "initial");
provider.setReadOnly();
assert.throws(() => locked.writeFileSync("/x.txt", "fail"), { code: "EROFS" });
console.log("unmounted=false; read-only writes throw EROFS");
