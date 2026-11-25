# Prompt 145: WASI — experimental

Category: Node.js core · Purpose: Explore system interfaces for WebAssembly programs.
Build a tiny file-reading program with the external WASI SDK and run it through node:wasi. Configure a fixture-directory preopen, verify expected output, and document the implementation’s security limitations.
Node explicitly cautions against relying on its WASI implementation to run untrusted code securely. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 145
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real WASI program opens hello.txt through its preopened directory and prints Hello from WASI.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

WASI supplies system interfaces to a WebAssembly program. Preopened directories map chosen host paths to guest-visible paths so the program can open its fixture.

### Follow the implementation

From [demo.mjs, lines 1-22](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

The executable route assembles the supplied WAT, instantiates it with WASI imports, and calls wasi.start. This host-directory mapping is not a claim that Node's WASI is a hostile-code sandbox.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the guest path in the WAT and the host preopens mapping. Predict what happens if the mapped directory no longer contains hello.txt.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The default reproducible demo assembles the supplied WAT with wabt. The equivalent read.c and build.ps1 are supplied for the external WASI SDK route; do not claim the C compiler ran. Node WASI preopens are convenience mappings, not a comprehensive security sandbox.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-145.png)
- [Original lesson and curated constraints](lesson-brief.txt)
