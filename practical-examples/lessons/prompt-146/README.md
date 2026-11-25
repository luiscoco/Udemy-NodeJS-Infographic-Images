# Prompt 146: Module customization hooks — experimental 1.2

Category: Node.js core · Purpose: Explore custom module resolution.
Implement a narrow module alias using module.registerHooks. Verify normal resolution still works, missing aliases fail clearly, and the hook avoids the deprecated module.register API.
The synchronous hook API is currently classified as a release candidate. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 146
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The preload hook resolves only explicit aliases, preserves node: imports and rejects an unknown alias.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Module customization hooks can resolve selected specifiers before the normal resolver. A preload registers the hook before the application's imports are evaluated.

### Follow the implementation

From [register.mjs, lines 1-14](register.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { registerHooks } from "node:module";
const aliases = new Map([
  ["@app/config", new URL("./src/config.mjs", import.meta.url).href],
]);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@app/")) {
      const url = aliases.get(specifier);
      if (!url) throw Error(`Unknown alias: ${specifier}`);
      return { url, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
```

From [demo.mjs, lines 1-6](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
const r = await spawnNode(["--import", "./register.mjs", "main.mjs"]);
console.log(r.stdout, r.stderr);
assert.equal(r.code, 0, r.stderr);
assert.ok(r.stdout.includes("course-app function"));
assert.ok(r.stderr.includes("Unknown alias: @app/missing"));
```

### Why this produces the observed result

The hook handles only an explicit alias map, returns shortCircuit for its own resolutions, and delegates all other imports. Unknown aliases fail clearly rather than becoming arbitrary paths.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a second known alias and import it. Verify a node: import still works, and explain why failing to delegate would break normal module resolution.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-146.png)
- [Original lesson and curated constraints](lesson-brief.txt)
