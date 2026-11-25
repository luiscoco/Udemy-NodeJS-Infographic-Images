# Prompt 105: Runtime permissions

Category: Node.js core · Purpose: Reduce the capabilities available to a trusted application.
Run a file-processing CLI under --permission with only the required filesystem access. Verify permitted operations succeed and denied file, network, and child-process operations fail; document why this is not a malicious-code sandbox.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 105
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Granted read/write work; a read outside the grant fails. The permission model is not a malicious-code sandbox.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

The runtime permission model grants specific capabilities to an application process. The lesson allows reads under the lab directory and writes only to its output directory.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, spawnNode } from "../../shared/lab.mjs";
await fs.mkdir("./lab/output", { recursive: true });
const flags = [
  "--permission",
  "--allow-fs-read=./lab",
  "--allow-fs-write=./lab/output",
];
let r = await spawnNode([...flags, "lab/main.mjs"]);
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
r = await spawnNode([...flags, "lab/denied.mjs"]);
assert.notEqual(r.code, 0);
assert.ok(r.stderr.includes("ERR_ACCESS_DENIED"));
console.log("outside read denied");

for (const file of ["lab/net-denied.mjs", "lab/process-denied.mjs"]) {
  const result = await spawnNode([...flags, file]);
  assert.notEqual(result.code, 0);
  assert.ok(result.stderr.includes("ERR_ACCESS_DENIED"), result.stderr);
  console.log(file, "denied by permission model");
}
```

### Why this produces the observed result

Separate children prove allowed filesystem operations and denied outside reads, network operations, and child-process creation. This is an application constraint mechanism, not a security sandbox for malicious code.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect each denied fixture and identify the missing grant. Explain why broadly granting a parent directory would weaken the narrow filesystem boundary demonstrated here.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-105.png)
- [Original lesson and curated constraints](lesson-brief.txt)
