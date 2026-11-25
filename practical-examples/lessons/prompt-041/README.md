# Prompt 41: Dependency inspection and security review

Category: Tooling · Purpose: Understand and review transitive dependencies.
Inspect a project with npm ls, npm explain, npm outdated, and npm audit. Review an installation script and a lockfile change, producing an evidence-based update decision rather than automatically applying forced upgrades.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 041
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual installed graph is inspected. --audit optionally requests live advisories; no fabricated vulnerability counts or force-fixes.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-041.png)
- [Original lesson and curated constraints](lesson-brief.txt)
