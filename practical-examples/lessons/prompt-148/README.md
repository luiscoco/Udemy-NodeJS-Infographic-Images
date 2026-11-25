# Prompt 148: Virtual filesystem — experimental, Node.js 26.4+

Category: Node.js core · Purpose: Create self-contained filesystem fixtures.
Use node:vfs with the required experimental flag to build an in-memory fixture tree. Verify reads and writes, unmount cleanup, and a read-only configuration without treating the virtual filesystem as a security boundary.
The module was added in Node.js 26.4. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 148
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Mounted reads succeed, cleanup unmounts the fixture, and irreversible read-only mode rejects writes. VFS is not a sandbox.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A virtual filesystem mounts provider-managed files where normal fs operations can read them. Mounting and unmounting have explicit lifetimes.

### Follow the implementation

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

The example reads a mounted JSON fixture, unmounts it, then demonstrates a provider's irreversible read-only transition. Read-only data and a VFS mount are not a security sandbox for arbitrary application code.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Attempt another write before and after setReadOnly. Explain why a failed write after the transition is expected even if the path previously existed.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-148.png)
- [Original lesson and curated constraints](lesson-brief.txt)
