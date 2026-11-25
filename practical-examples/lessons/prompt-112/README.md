# Prompt 112: Linting and formatting

Category: Tooling · Purpose: Catch common mistakes and maintain consistent source formatting.
Configure eslint, @eslint/js, and prettier for an ESM project. Add check-only CI commands and verify they detect an unused variable, an undefined identifier, and a formatting violation.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 112
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

ESLint finds actual unused/undefined identifiers; Prettier distinguishes unformatted and formatted source.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Linting and formatting answer different questions. ESLint detects configured code-quality problems, while Prettier normalizes presentation.

### Follow the implementation

From [demo.mjs, lines 1-19](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import prettier from "prettier";
import assert from "node:assert/strict";
const lint = new ESLint({
  overrideConfigFile: fileURLToPath(
    new URL("./eslint.config.mjs", import.meta.url),
  ),
});
const [bad] = await lint.lintText("const unused = 1; missingName();", {
  filePath: "fixture.mjs",
});
console.log(bad.messages.map((x) => ({ rule: x.ruleId, message: x.message })));
assert.ok(bad.errorCount >= 2);
const original = "const x={a:1};console.log(x)",
  formatted = await prettier.format(original, { parser: "babel" });
assert.equal(await prettier.check(original, { parser: "babel" }), false);
assert.equal(await prettier.check(formatted, { parser: "babel" }), true);
console.log(formatted);
```

### Why this produces the observed result

The fixture contains real undefined and unused identifiers for linting, then compares the formatter's check result before and after formatting. A clean format does not prove correct program behavior.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Format the invalid fixture and lint it again. Explain why formatting cannot repair an undefined variable or replace tests of the function's result.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-112.png)
- [Original lesson and curated constraints](lesson-brief.txt)
