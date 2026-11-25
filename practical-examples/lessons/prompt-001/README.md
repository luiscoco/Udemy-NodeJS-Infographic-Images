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

## Walkthrough and experiments

Use fnm or nvm to select the .node-version value, then compare command resolution. The application verifies the runtime rather than changing a machine-wide installation.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-001.png)
- [Original lesson and curated constraints](lesson-brief.txt)
