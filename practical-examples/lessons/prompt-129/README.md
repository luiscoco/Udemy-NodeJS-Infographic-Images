# Prompt 129: TypeScript compilation and declarations

Category: Tooling · Purpose: Add static checking and distributable JavaScript.
Create a TypeScript library using typescript and baseline-compatible @types/node with NodeNext settings. Emit JavaScript, declarations, and source maps, then verify a separate consumer can import the built package.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 129
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Compilation emits runnable JavaScript, declarations and source maps; the compiled library returns the greeting.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Compilation turns TypeScript into JavaScript for execution and can emit declarations for consumers plus source maps for debugging. Those artifacts have distinct purposes.

### Follow the implementation

From [src/index.ts, lines 1-3](src/index.ts#L1) (source excerpt; run the full application using the command above):

```typescript
export function greet(name: string): string {
  return "Hello, " + name;
}
```

From [tsconfig.json, lines 1-14](tsconfig.json#L1) (source excerpt; run the full application using the command above):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
const build = await npm(["exec", "--", "tsc", "-p", "tsconfig.json"]);
assert.equal(build.code, 0, build.stdout + build.stderr);
const declaration = await fs.readFile("./dist/index.d.ts", "utf8");
assert.ok(declaration.includes("greet"));
const run = await spawnNode([
  "--input-type=module",
  "--eval",
  "import {greet} from './dist/index.js';console.log(greet('student'));",
]);
console.log(run.stdout, declaration);
assert.equal(run.stdout.trim(), "Hello, student");
```

### Why this produces the observed result

The demo invokes the supplied tsconfig, checks the declaration export, and runs the compiled JavaScript. Declaration files describe types; they do not contain the executable implementation.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the greeting parameter type and rebuild. Inspect both emitted JavaScript and `.d.ts`, and explain why a consumer needs the JavaScript even when declarations exist.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-129.png)
- [Original lesson and curated constraints](lesson-brief.txt)
