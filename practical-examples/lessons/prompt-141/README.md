# Prompt 141: Deployment and rollback

Category: Tooling · Purpose: Release changes while preserving a recovery path.
Build a local deployment rehearsal with two application versions and a backward-compatible PostgreSQL migration. Verify both versions work during transition and demonstrate rollback without reversing an unsafe data transformation.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 141
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Mixed versions read the old authoritative field. After old writers drain, a catch-up backfill repairs even non-null stale derived values.

## Walkthrough and experiments

The final catch-up intentionally copies ALL authoritative title values, rather than only NULL values: a v1 writer can leave a non-null display_title stale. Keep additive columns throughout the rollback window; contract in a later release.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-141.png)
- [Original lesson and curated constraints](lesson-brief.txt)
