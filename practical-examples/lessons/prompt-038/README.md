# Prompt 38: Lockfiles and reproducible installation

Category: Tooling · Purpose: Recreate the intended dependency graph.
Generate a lockfile and verify installation with npm ci in a clean directory. Deliberately introduce a manifest mismatch and demonstrate the expected failure and correct repair workflow.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 038
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Offline local dependency installation creates a real lockfile; ci succeeds, then rejects manifest drift.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A lockfile records a resolved dependency tree. `npm install` can create or update it, while `npm ci` requires it to agree with the manifest and performs a reproducible installation.

### Follow the implementation

From [demo.mjs, lines 1-31](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "lib"));
await fs.writeFile(
  join(lab.path, "lib/package.json"),
  '{"name":"course-local-lib","version":"1.0.0"}',
);
const manifest = {
  name: "course-lock-lab",
  version: "1.0.0",
  private: true,
  dependencies: { "course-local-lib": "file:./lib" },
};
await fs.writeFile(join(lab.path, "package.json"), JSON.stringify(manifest));
for (const command of ["install", "ci"]) {
  const r = await npm(
    [command, "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
    { cwd: lab.path },
  );
  assert.equal(r.code, 0, r.stderr);
  console.log(command, "succeeded");
}
manifest.dependencies.extra = "file:./lib";
await fs.writeFile(join(lab.path, "package.json"), JSON.stringify(manifest));
const mismatch = await npm(
  ["ci", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: lab.path },
);
assert.notEqual(mismatch.code, 0);
console.log("manifest/lock mismatch rejected");
```

### Why this produces the observed result

The demo uses a local dependency so the installation experiment can run offline. After manifest drift, the failing ci run proves that the lockfile is an enforced contract rather than a comment.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a dependency to the temporary manifest without changing its lockfile. Explain why ci rejects the mismatch and why regenerating the lockfile is a reviewed change.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-038.png)
- [Original lesson and curated constraints](lesson-brief.txt)
