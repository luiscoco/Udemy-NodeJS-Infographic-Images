# Prompt 44: Paths and containment

Category: Node.js core · Purpose: Keep file access within an intended directory.
Implement a file resolver using node:path and appropriate real-path checks inside a controlled fixture directory. Test traversal, absolute paths, and symlinks; document remaining race-condition limitations.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 044
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Existing-file resolution permits the fixture and rejects traversal, absolute input and missing files.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A path containment check must reason about resolved filesystem paths, not only remove `..` text. The example rejects absolute input and compares a real target path with the real allowed root.

### Follow the implementation

From [demo.mjs, lines 1-21](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { resolve, relative, isAbsolute, sep } from "node:path";
await using lab = await temp();
const root = join(lab.path, "root");
await fs.mkdir(root);
await fs.writeFile(join(root, "allowed.txt"), "allowed");
await fs.writeFile(join(lab.path, "outside.txt"), "outside");
async function inside(input) {
  if (isAbsolute(input)) throw Error("Absolute path rejected");
  const base = await fs.realpath(root),
    target = await fs.realpath(resolve(base, input)),
    rel = relative(base, target);
  if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel))
    throw Error("Outside root");
  return target;
}
console.log(await inside("allowed.txt"));
await assert.rejects(inside("../outside.txt"), /Outside/);
await assert.rejects(inside(join(root, "allowed.txt")), /Absolute/);
await assert.rejects(inside("missing"), { code: "ENOENT" });
console.log("traversal, absolute path and missing file checks passed");
```

### Why this produces the observed result

`realpath` resolves existing links before `relative` checks containment. This existing-file check does not eliminate races if another actor can replace filesystem entries between checking and opening them.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Try a valid nested file and a sibling traversal. Explain why `input.startsWith(root)` would incorrectly accept some sibling names and why missing targets are rejected here.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

realpath resolves symlinks, but check/open remains a TOCTOU race on a hostile filesystem. This is not a general sandbox.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-044.png)
- [Original lesson and curated constraints](lesson-brief.txt)
