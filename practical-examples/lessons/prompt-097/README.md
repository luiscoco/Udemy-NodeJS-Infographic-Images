# Prompt 97: Password derivation

Category: Node.js core · Purpose: Store password verification material appropriately.
Implement password registration and verification using asynchronous crypto.scrypt, random salts, and safe comparison. Verify correct and incorrect passwords, malformed stored records, and distinct stored values for identical passwords.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 097
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Versioned, salted scrypt records verify correctly without logging passwords or hashes.

## Walkthrough and experiments

The fixed cost is N=131072,r=8,p=1 with a bounded maxmem setting. Each active derivation uses substantial memory; bound authentication concurrency and measure your deployment.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-097.png)
- [Original lesson and curated constraints](lesson-brief.txt)
