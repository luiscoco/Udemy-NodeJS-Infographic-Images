# Prompt 1: Installation and version management

Category: Tooling · Purpose: Reproduce the same runtime across development environments.
Set up Node.js 26.13.1 using the external fnm version manager, with commands appropriate to my OS. Pin the project version and verify the active executable, Node.js version, and npm version; demonstrate diagnosing a conflicting installation.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 001
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Prints the actual executable and pinned runtime. A different version fails explicitly.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A project version pin records the runtime the course expects; it does not select the executable for your shell. `process.execPath` identifies the binary actually running, while `process.version` identifies its Node release.

### Follow the implementation

From [demo.mjs, lines 1-10](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { realpath } from "node:fs/promises";
console.log({
  executable: await realpath(process.execPath),
  node: process.version,
  v8: process.versions.v8,
  platform: process.platform,
  arch: process.arch,
});
if (process.versions.node !== "26.13.1")
  throw Error("Select the pinned course runtime: 26.13.1");
```

### Why this produces the observed result

The version guard makes an incorrect runtime visible immediately. Comparing the resolved executable with your version manager helps explain why installing a version and activating it are separate steps.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Use your version manager to select the pinned release, then compare the printed executable with your shell's Node command. Explain why editing `.node-version` alone cannot change an already running process.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use fnm or nvm to select the .node-version value, then compare command resolution. The application verifies the runtime rather than changing a machine-wide installation.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-001.png)
- [Original lesson and curated constraints](lesson-brief.txt)
