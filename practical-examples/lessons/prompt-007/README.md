# Prompt 7: Application watch mode

Category: Node.js core · Purpose: Shorten the edit-and-run development loop.
Create a small application run with node --watch. Change an imported module and verify automatic restart; explain the difference between ordinary watch mode and the platform restrictions of --watch-path.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 007
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Edit message.mjs in another editor: watch mode restarts and prints the changed message. Stop with Ctrl+C.

## Walkthrough and experiments

Watch mode is intentionally interactive and is excluded from the unattended validator. In-memory state resets on each restart.

## Requirements and validation

Execution mode: **interactive**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-007.png)
- [Original lesson and curated constraints](lesson-brief.txt)
