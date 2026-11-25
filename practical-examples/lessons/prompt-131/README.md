# Prompt 131: Native addons with Node-API

Category: Node.js core · Purpose: Integrate native code through a supported addon interface.
Build a minimal native addon using node-addon-api and node-gyp. State the required compiler and Python setup, validate arguments, and verify the addon loads and returns correct results on the target platform.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 131
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

After native compilation, the addon returns 42 and rejects a nonnumeric argument.

## Walkthrough and experiments

Windows requires Visual Studio C++ Build Tools and Python; macOS requires Xcode CLI tools; Linux requires make and a supported compiler. Node-API ABI stability does not remove OS/architecture constraints.

## Requirements and validation

Execution mode: **native-tooling**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-131.png)
- [Original lesson and curated constraints](lesson-brief.txt)
