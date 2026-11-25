# Prompt 156: Explicit Resource Management

Use using and await using to manage file handles and temporary directories. Verify resources are disposed in reverse declaration order on normal completion and on an exception; distinguish scope exit from process termination.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 156
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

hello
removed

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Explicit resource management ties cleanup to lexical scope. `await using` invokes asynchronous disposal when control leaves the block, including an exceptional exit.

### Follow the implementation

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { mkdtempDisposable, open, readFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let path;
{
  await using temp = await mkdtempDisposable(join(tmpdir(), "node-lab-"));
  path = temp.path;
  await using file = await open(join(path, "note.txt"), "w+");
  await file.writeFile("hello");
  console.log(await readFile(join(path, "note.txt"), "utf8"));
}
try {
  await access(path);
  console.log("exists");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("removed");
}
```

### Why this produces the observed result

Resources dispose in reverse declaration order, so the file handle closes before its temporary directory is removed. The ENOENT check after the block proves the directory's lifetime ended.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Throw an error after writing the file, catch it outside the block, and inspect whether the directory remains. Explain why lexical cleanup is more reliable than a cleanup statement placed only at the happy-path end.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

using is JavaScript syntax; Node resources expose Symbol.dispose or Symbol.asyncDispose. await using awaits cleanup. The file closes before the temporary folder is removed (reverse declaration order). Normal block exit, return and thrown exceptions trigger disposal; abrupt process termination does not guarantee it. This sample requires no external package. Complete the exercise: throw inside the block and verify cleanup in a surrounding catch; compare with try/finally. Disposal errors can also propagate.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-156.png)
- [Original lesson and curated constraints](lesson-brief.txt)
