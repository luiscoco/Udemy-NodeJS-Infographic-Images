import { readFile } from "node:fs/promises";
import { WASI } from "node:wasi";
const wasi = new WASI({
  version: "preview1",
  args: ["read"],
  preopens: { "/fixtures": "./fixtures" },
});
const wasm = await WebAssembly.compile(await readFile("./read.wasm"));
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
process.exitCode = wasi.start(instance);
