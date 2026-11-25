# Prompt 113: Interactive debugging

Category: Node.js core · Purpose: Inspect program state before guessing at a fix.
Create a reproducible calculation bug and debug it with --inspect-brk using an editor or DevTools. Set a conditional breakpoint, inspect variables, and verify a regression test fails before the fix.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 113
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The regression test fails on -1900 from the buggy formula and passes on 80 after the fix.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A regression test turns a discovered bug into a repeatable failure. The harness runs the same test against broken and fixed discount implementations.

### Follow the implementation

From [broken.mjs, lines 1-4](broken.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
export function total(price, percent) {
  return price * (1 - percent);
}
console.log(total(100, 20));
```

From [fixed.mjs, lines 1-3](fixed.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
export function total(price, percent) {
  return price * (1 - percent / 100);
}
```

From [discount.test.mjs, lines 1-6](discount.test.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import test from "node:test";
import assert from "node:assert/strict";
const { total } = await import(
  "./" + (process.env.DISCOUNT_VERSION ?? "fixed") + ".mjs"
);
test("20 percent discount", () => assert.equal(total(100, 20), 80));
```

### Why this produces the observed result

The broken formula produces a clearly wrong value, while the fixed implementation satisfies the existing expectation. Debugging should identify the bad expression before changing the assertion to match it.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run the supplied test in your debugger and inspect the formula's operands. Explain why multiplying by a percentage requires converting the percentage to a ratio.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

For a breakpoint demonstration run node --inspect-brk broken.mjs, attach DevTools locally, and inspect price=100 and percent=20.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-113.png)
- [Original lesson and curated constraints](lesson-brief.txt)
