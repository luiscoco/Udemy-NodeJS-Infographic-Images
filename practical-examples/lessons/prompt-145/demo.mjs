import wabtInit from "wabt";
import { WASI } from "node:wasi";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const wabt = await wabtInit(),
  parsed = wabt.parseWat(
    "read.wat",
    await readFile(new URL("./read.wat", import.meta.url), "utf8"),
  );
const { buffer } = parsed.toBinary({});
parsed.destroy();
const wasi = new WASI({
  version: "preview1",
  args: ["read"],
  preopens: {
    "/fixtures": fileURLToPath(new URL("./fixtures/", import.meta.url)),
  },
});
const wasm = await WebAssembly.compile(buffer),
  instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
assert.equal(wasi.start(instance), 0);
