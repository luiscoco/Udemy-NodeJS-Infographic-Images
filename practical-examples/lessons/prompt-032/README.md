# Prompt 32: Package exports and imports

Category: Node.js core · Purpose: Define a deliberate public package interface.
Create a package using exports for public entry points and imports for internal aliases. Install its packed archive into a separate consumer and verify public imports succeed while an unexported subpath fails.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 032
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real tarball installs into a separate consumer: public import returns 42 and private subpath import fails.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Package `exports` defines the public entry points that consumers may resolve, while `imports` provides package-internal aliases such as `#utils`.

### Follow the implementation

From [demo.mjs, lines 9-20](demo.mjs#L9) (source excerpt; run the full application using the command above):

```javascript
await fs.writeFile(
  join(lib, "package.json"),
  JSON.stringify({
    name: "course-demo-lib",
    version: "1.0.0",
    type: "module",
    exports: { ".": "./src/index.js" },
    imports: { "#utils": "./src/utils.js" },
  }),
);
await fs.writeFile(join(lib, "src/utils.js"), "export const answer=42;");
await fs.writeFile(join(lib, "src/index.js"), "export {answer} from '#utils';");
```

From [demo.mjs, lines 33-39](demo.mjs#L33) (source excerpt; run the full application using the command above):

```javascript
await fs.writeFile(
  join(consumer, "test.mjs"),
  "import {answer} from 'course-demo-lib';console.log(answer);try{await import('course-demo-lib/src/utils.js');throw Error('must reject');}catch(e){if(e.code!=='ERR_PACKAGE_PATH_NOT_EXPORTED')throw e;console.log(e.code);}",
);
r = await spawnNode(["test.mjs"], { cwd: consumer });
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
```

### Why this produces the observed result

The demo creates a tarball and installs it into a separate consumer, proving the boundary outside the library's own directory. An exports map controls module resolution; it is not an operating-system security boundary.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add an explicit public subpath export and update the consumer check. Predict why the original private path fails before that export exists.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-032.png)
- [Original lesson and curated constraints](lesson-brief.txt)
