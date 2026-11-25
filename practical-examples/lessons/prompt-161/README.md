# Prompt 161: Snapshot Testing

Create a stable snapshot for a small result object using node:test. Review and commit the generated snapshot, detect a deliberate output change, and retain focused assertions for important behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 161
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The snapshot is actually generated and then compared in a separate normal test run.

## Walkthrough and experiments

Snapshot testing is stable on this baseline. Workflow: generate -> inspect the human-readable diff -> commit -> run without the update flag. The first command creates snapshot.test.mjs.snapshot; the second compares to it. Without an existing snapshot, a normal run fails. A deliberate result change causes a mismatch; updating snapshots accepts current output, it does not prove it is correct. Keep explicit assertions for invariants, errors, authorization and cleanup. Normalize timestamps, random IDs, environment-specific paths and unstable ordering before snapshotting, without hiding meaningful changes. Never run update mode automatically merely to make CI green. Verification scenarios are expected: baseline passes after reviewed generation; changed output fails; reviewed intentional update passes. Do not invent reporter text or serialize a fake snapshot file.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-161.png)
- [Original lesson and curated constraints](lesson-brief.txt)
