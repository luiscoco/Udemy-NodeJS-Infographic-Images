# Prompt 130: Type checking JavaScript with JSDoc

Category: Tooling · Purpose: Gain static feedback without changing the implementation language.
Add JSDoc types to an existing JavaScript module and check it with typescript using checkJs and no emit. Introduce an incorrect argument type and verify the checker catches it while Node still runs ordinary JavaScript.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 130
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

JavaScript permits string concatenation at runtime; JSDoc checking detects the bad argument and accepts the fixed call.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

JSDoc can add static type information to JavaScript while leaving it directly executable. `--checkJs` and `--noEmit` ask the checker to report problems without generating replacement source.

### Follow the implementation

From [bad.js, lines 1-5](bad.js#L1) (source excerpt; run the full application using the command above):

```javascript
/** @param {number} a @param {number} b @returns {number} */
export function add(a, b) {
  return a + b;
}
console.log(add("2", 3));
```

From [fixed.js, lines 1-5](fixed.js#L1) (source excerpt; run the full application using the command above):

```javascript
/** @param {number} a @param {number} b @returns {number} */
export function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
```

From [demo.mjs, lines 6-19](demo.mjs#L6) (source excerpt; run the full application using the command above):

```javascript
  const check = await npm([
    "exec",
    "--",
    "tsc",
    "--allowJs",
    "--checkJs",
    "--noEmit",
    "--skipLibCheck",
    "--module",
    "NodeNext",
    "--target",
    "ES2022",
    file,
  ]);
```

### Why this produces the observed result

The bad fixture still executes JavaScript's string concatenation, while the checker reports a wrong argument type. The fixed file satisfies both runtime and static expectations.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change another call to pass a string where the JSDoc expects a number. Explain why a static error does not automatically stop a separate unchecked runtime invocation.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-130.png)
- [Original lesson and curated constraints](lesson-brief.txt)
