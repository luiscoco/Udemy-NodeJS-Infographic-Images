# Prompt 137: Continuous integration

Category: Tooling · Purpose: Check changes consistently before delivery.
Create a GitHub Actions workflow that installs from the lockfile, checks formatting, lints, and runs tests. Include appropriate OS coverage and verify an intentionally broken change fails the pipeline.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 137
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The supplied multi-OS GitHub Actions workflow runs reproducible installation and the real validation commands.

## Walkthrough and experiments

The workflow file is also installed under the repository .github/workflows directory. A remote run only happens after a user-authorized push.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-137.png)
- [Original lesson and curated constraints](lesson-brief.txt)
