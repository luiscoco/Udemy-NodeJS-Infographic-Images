# Prompt 43: Filesystem operations

Category: Node.js core · Purpose: Read and write files with predictable failure handling.
Build a file utility with node:fs/promises that creates, reads, appends, and deletes a temporary file. Verify missing-file errors and ensure explicitly opened file handles close after both success and failure.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 043
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The temporary file is created, appended, read through an owned handle, and removed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Promise-based filesystem operations express the order of create, append, read, and remove. An explicitly opened file handle has its own lifetime and must be closed.

### Follow the implementation

From [demo.mjs, lines 1-14](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "demo.txt");
await fs.writeFile(file, "Hello");
await fs.appendFile(file, ", Node.js!");
const handle = await fs.open(file, "r");
try {
  console.log(await handle.readFile("utf8"));
} finally {
  await handle.close();
}
await fs.rm(file);
await assert.rejects(fs.readFile(file), { code: "ENOENT" });
console.log("ENOENT after removal");
```

### Why this produces the observed result

The `finally` block closes the handle even if reading fails. After deletion, ENOENT is an expected error code that the application asserts rather than confusing with successful empty content.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Read the file before and after append, then explain how an empty file differs from a path that no longer exists.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-043.png)
- [Original lesson and curated constraints](lesson-brief.txt)
