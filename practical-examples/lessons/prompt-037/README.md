# Prompt 37: Portable npm scripts

Category: Tooling · Purpose: Make common development commands consistent.
Add npm scripts for checking, testing, running, and cleaning a project. Use Node.js scripts for filesystem operations instead of shell-specific commands, and verify equivalent behavior on Windows and POSIX shells.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 037
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A portable Node cleanup removes only a generated, project-owned directory.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Portable npm scripts can delegate filesystem work to Node instead of relying on shell-specific delete commands. The example operates only inside a temporary directory it owns.

### Follow the implementation

From [demo.mjs, lines 1-9](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "dist"));
await fs.writeFile(join(lab.path, "dist/generated.txt"), "generated");
const r = await spawnNode(["--check", "main.mjs"]);
assert.equal(r.code, 0);
await fs.rm(join(lab.path, "dist"), { recursive: true, force: true });
await assert.rejects(fs.access(join(lab.path, "dist")));
console.log("syntax checked; only owned generated dist removed");
```

### Why this produces the observed result

The syntax check runs before the generated dist directory is removed. Restricting cleanup to an explicitly created output path makes the operation predictable across platforms.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a sibling source fixture outside dist. Run the cleanup and verify the source fixture survives while the generated directory is removed.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-037.png)
- [Original lesson and curated constraints](lesson-brief.txt)
