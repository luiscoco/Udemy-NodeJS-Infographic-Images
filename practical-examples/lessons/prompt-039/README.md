# Prompt 39: Semantic versioning and updates

Category: Tooling · Purpose: Understand which dependency changes a project permits.
Create a controlled example comparing exact, caret, and tilde version ranges. Use npm inspection commands to explain installed versus allowed versions and verify the effect of an intentional dependency update.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 039
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real semver evaluation demonstrates exact, caret, tilde, and pre-1.0 ranges.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A semantic-version range selects acceptable releases, while a lockfile records a specific resolution. Exact, caret, and tilde ranges express different update boundaries.

### Follow the implementation

From [demo.mjs, lines 1-18](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import semver from "semver";
import assert from "node:assert/strict";
for (const [range, yes, no] of [
  ["1.2.3", "1.2.3", "1.2.4"],
  ["^1.2.3", "1.9.0", "2.0.0"],
  ["~1.2.3", "1.2.9", "1.3.0"],
  ["^0.2.3", "0.2.9", "0.3.0"],
]) {
  console.log(
    range,
    yes,
    semver.satisfies(yes, range),
    no,
    semver.satisfies(no, range),
  );
  assert.ok(semver.satisfies(yes, range));
  assert.ok(!semver.satisfies(no, range));
}
```

### Why this produces the observed result

The semver library evaluates actual examples, including the narrower caret behavior for pre-1.0 versions. A syntactically allowed update still needs compatibility checks.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add the range `^0.0.3` with nearby candidate versions. Predict the accepted versions, then verify them with semver.satisfies.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-039.png)
- [Original lesson and curated constraints](lesson-brief.txt)
