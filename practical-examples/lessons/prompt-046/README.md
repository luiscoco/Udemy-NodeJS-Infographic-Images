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

## Walkthrough and experiments

Same-filesystem rename provides visibility semantics, not an automatic crash-durability guarantee or concurrent-update lock.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-046.png)
- [Original lesson and curated constraints](lesson-brief.txt)
