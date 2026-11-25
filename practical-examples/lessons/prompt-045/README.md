# Prompt 45: Directory traversal

Category: Node.js core · Purpose: Inspect directory trees without loading everything at once.
Build an asynchronous directory walker using opendir and file metadata. Define a symlink policy, handle inaccessible entries, and verify it avoids cycles and reports correct file counts.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 045
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A lazy recursive walker finds two real fixtures and avoids following symbolic links.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An async generator can traverse a directory lazily, yielding files as they are found. `opendir` avoids first collecting the entire recursive tree.

### Follow the implementation

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "nested"));
await fs.writeFile(join(lab.path, "a.txt"), "a");
await fs.writeFile(join(lab.path, "nested/b.txt"), "b");
async function* walk(dir) {
  for await (const entry of await fs.opendir(dir)) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}
const files = [];
for await (const path of walk(lab.path)) files.push(path);
console.log(files);
assert.equal(files.length, 2);
```

### Why this produces the observed result

The walker distinguishes regular files, directories, and symbolic links. Skipping links avoids following a link into a cycle or outside the intended tree in this teaching example.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a second nested directory and file. Predict the new count, and explain why the application should not depend on a particular directory enumeration order.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-045.png)
- [Original lesson and curated constraints](lesson-brief.txt)
