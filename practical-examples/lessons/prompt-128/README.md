# Prompt 128: Native TypeScript execution

Category: Node.js core · Purpose: Understand the runtime’s limited TypeScript support.
Run a small .ts program containing erasable types directly with Node.js. Demonstrate that a type mismatch can still execute, identify unsupported syntax, and explain why execution is not type checking.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 128
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Native execution strips erasable types and prints 42 despite a static type error; the TypeScript checker rejects it.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Native TypeScript execution strips supported erasable syntax but does not perform static type checking. Running a `.ts` file and checking its types are separate steps.

### Follow the implementation

From [native.ts, lines 1-5](native.ts#L1) (source excerpt; run the full application using the command above):

```typescript
function twice(value: number): number {
  return value * 2;
}
const input: number = "21";
console.log(twice(input));
```

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
const run = await spawnNode(["native.ts"]);
console.log("runtime:", run.stdout);
assert.equal(run.stdout.trim(), "42");
const check = await npm([
  "exec",
  "--",
  "tsc",
  "--noEmit",
  "--skipLibCheck",
  "--target",
  "ES2022",
  "native.ts",
]);
console.log("checker:", check.stdout);
assert.notEqual(check.code, 0);
```

### Why this produces the observed result

The fixture executes to 42 even though the TypeScript checker rejects its assignment. The harness asserts both outcomes so students can distinguish runtime success from type safety.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Fix the type error without changing the computed value. Predict that runtime output stays 42 while the checker result changes to success, and update the harness expectation for that experiment.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-128.png)
- [Original lesson and curated constraints](lesson-brief.txt)
