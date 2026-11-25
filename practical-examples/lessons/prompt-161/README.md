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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A snapshot records a reviewed expected representation. A normal test compares the current value with that baseline, while an update command intentionally replaces the baseline.

### Follow the implementation

From [snapshot.test.mjs, lines 1-7](snapshot.test.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";

test("stable result contract", (t) => {
  const result = { status: "ok", items: ["a", "b"] };
  t.assert.equal(result.items.length, 2);
  t.assert.snapshot(result);
});
```

From [demo.mjs, lines 1-9](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [
  ["--test", "--test-update-snapshots", "snapshot.test.mjs"],
  ["--test", "snapshot.test.mjs"],
]) {
  const r = await spawnNode(args);
  console.log(r.stdout);
  assert.equal(r.code, 0, r.stderr);
}
```

### Why this produces the observed result

The fixture also keeps a focused length assertion. The demo first generates a snapshot and then verifies it, so students must run the normal command directly when experimenting with an unexpected change; auto-updating would hide that change.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Generate the baseline once, modify the result, then run `node --test snapshot.test.mjs` from this lesson folder without the update flag. Review the diff before deciding whether the change is intended.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Snapshot testing is stable on this baseline. Workflow: generate -> inspect the human-readable diff -> commit -> run without the update flag. The first command creates snapshot.test.mjs.snapshot; the second compares to it. Without an existing snapshot, a normal run fails. A deliberate result change causes a mismatch; updating snapshots accepts current output, it does not prove it is correct. Keep explicit assertions for invariants, errors, authorization and cleanup. Normalize timestamps, random IDs, environment-specific paths and unstable ordering before snapshotting, without hiding meaningful changes. Never run update mode automatically merely to make CI green. Verification scenarios are expected: baseline passes after reviewed generation; changed output fails; reviewed intentional update passes. Do not invent reporter text or serialize a fake snapshot file.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-161.png)
- [Original lesson and curated constraints](lesson-brief.txt)
