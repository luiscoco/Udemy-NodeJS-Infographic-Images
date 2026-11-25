# Prompt 111: Coverage — experimental

Category: Node.js core · Purpose: Identify behavior that tests have not exercised.
Collect coverage with node --test --experimental-test-coverage. Find an uncovered failure branch, add a behavior-focused test, and explain why higher coverage alone does not establish correctness.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 111
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real coverage report changes when a negative-total branch is tested. No coverage percentage is fabricated.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Coverage records which code paths a test suite executes. Running a baseline and a more complete suite makes the previously untested negative-total branch visible.

### Follow the implementation

From [discount.mjs, lines 1-4](discount.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
export function discount(total, member) {
  if (total < 0) throw Error("Invalid total");
  return member ? total * 0.9 : total;
}
```

From [complete.test.mjs, lines 1-8](complete.test.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { discount } from "./discount.mjs";
test("all behaviors", () => {
  assert.equal(discount(100, true), 90);
  assert.equal(discount(100, false), 100);
  assert.throws(() => discount(-1, true), /Invalid total/);
});
```

From [demo.mjs, lines 1-6](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const file of ["baseline.test.mjs", "complete.test.mjs"]) {
  const r = await spawnNode(["--test", "--experimental-test-coverage", file]);
  console.log(file, r.stdout);
  assert.equal(r.code, 0, r.stderr);
}
```

### Why this produces the observed result

The lesson prints the runtime's actual experimental coverage report rather than inventing a percentage. Execution coverage is useful evidence, but it does not establish that the assertions are strong or the business rule is correct.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Remove the negative-total assertion and compare reports. Explain how a test could execute that branch while still failing to verify its returned value.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-111.png)
- [Original lesson and curated constraints](lesson-brief.txt)
