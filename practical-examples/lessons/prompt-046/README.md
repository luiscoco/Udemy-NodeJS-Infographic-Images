# Prompt 46: Safe file replacement

Category: Node.js core · Purpose: Reduce the risk of corrupting existing data.
Implement configuration replacement using a temporary file and rename within one directory. Inject a failure before replacement and verify the original remains intact; explain atomicity versus crash durability.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 046
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Injected failure preserves old content and removes the partial file; success publishes new content.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Publishing a replacement only after it is fully written protects readers from incomplete output. The demo writes an exclusively created sibling temporary file and then renames it onto the destination.

### Follow the implementation

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { randomUUID } from "node:crypto";
await using lab = await temp();
const file = join(lab.path, "record.txt");
await fs.writeFile(file, "old");
async function replace(text, fail = false) {
  const partial = file + "." + randomUUID() + ".tmp";
  try {
    await fs.writeFile(partial, text, { flag: "wx" });
    if (fail) throw Error("injected failure");
    await fs.rename(partial, file);
  } finally {
    await fs.rm(partial, { force: true });
  }
}
await assert.rejects(replace("incomplete", true));
assert.equal(await fs.readFile(file, "utf8"), "old");
await replace("new");
console.log(await fs.readFile(file, "utf8"), await fs.readdir(lab.path));
```

### Why this produces the observed result

An injected failure leaves the old destination intact, and `finally` removes leftover temporary output. Same-directory rename supports the publication pattern; crash durability would additionally require filesystem-specific synchronization decisions.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inject failure before rename and compare the destination bytes with the original. Explain why writing directly over the destination would make recovery harder.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Same-filesystem rename provides visibility semantics, not an automatic crash-durability guarantee or concurrent-update lock.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-046.png)
- [Original lesson and curated constraints](lesson-brief.txt)
