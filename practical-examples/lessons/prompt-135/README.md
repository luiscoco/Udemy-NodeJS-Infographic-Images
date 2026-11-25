# Prompt 135: Deprecated API migration

Category: Node.js core · Purpose: Recognize and remove outdated runtime dependencies.
Create a small legacy fixture using deprecated Buffer construction and node:domain, then migrate it to appropriate current APIs. Use deprecation diagnostics and regression tests to verify the replacement behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 135
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual runtime reports legacy warnings or removal errors; modern code preserves the content without relying on deprecated APIs.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Deprecation migration replaces APIs whose support or behavior may change. Warning and trace flags make the actual runtime's legacy diagnostics visible.

### Follow the implementation

From [modern.mjs, lines 1-7](modern.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
const data = Buffer.from("hello", "utf8");
try {
  console.log(data.toString());
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
```

From [demo.mjs, lines 1-16](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
const legacy = await spawnNode([
  "--pending-deprecation",
  "--trace-deprecation",
  "legacy.mjs",
]);
console.log(
  "legacy stdout:",
  legacy.stdout,
  "legacy diagnostics:",
  legacy.stderr,
);
const modern = await spawnNode(["modern.mjs"]);
console.log("modern:", modern.stdout);
assert.equal(modern.code, 0, modern.stderr);
assert.equal(modern.stdout.trim(), "hello");
```

### Why this produces the observed result

The legacy fixture is inspected as-is, while the modern implementation is checked for equivalent content. Depending on the pinned release, a legacy API may warn or already be unavailable.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare the modern Buffer construction with the legacy form. Explain which input interpretation the explicit modern API makes clear and why warning-free output alone does not prove semantic equivalence.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-135.png)
- [Original lesson and curated constraints](lesson-brief.txt)
