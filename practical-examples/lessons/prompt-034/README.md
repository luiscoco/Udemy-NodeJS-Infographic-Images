# Prompt 34: Module-relative assets and JSON imports

Category: Node.js core · Purpose: Locate assets independently of the working directory.
Load a text asset relative to import.meta.url and import JSON using the baseline’s supported import attributes. Run the application from another directory and verify both resources still load.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 034
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Module-relative assets load consistently even when the shell current directory changes.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A module-relative URL anchors asset lookup to the source file instead of the shell's current directory. JSON import attributes identify the imported resource's type.

### Follow the implementation

From [demo.mjs, lines 1-6](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { readFile } from "node:fs/promises";
import settings from "./settings.json" with { type: "json" };
console.log(
  settings.title,
  (await readFile(new URL("./message.txt", import.meta.url), "utf8")).trim(),
);
```

### Why this produces the observed result

`new URL(..., import.meta.url)` keeps the text asset beside the module regardless of where the launcher starts. This differs from resolving `./message.txt` against process.cwd().

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Launch the module from another directory using its full path. Compare the current URL-based read with a deliberately cwd-relative read.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-034.png)
- [Original lesson and curated constraints](lesson-brief.txt)
