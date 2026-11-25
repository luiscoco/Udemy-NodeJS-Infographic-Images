# Prompt 42: Packaging and publishing preparation

Category: Tooling · Purpose: Verify what consumers will actually receive.
Prepare a library with a files allowlist, README, license, and release metadata. Inspect npm pack --dry-run and npm publish --dry-run, install the resulting archive into a consumer, and verify secrets and development fixtures are excluded.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 042
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The npm pack dry run includes the distributable entry and excludes the secret-shaped fixture. No package is published.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A package's published contents are a separate contract from the files in its repository. A `files` allowlist keeps the intended distributable directory in the package.

### Follow the implementation

From [demo.mjs, lines 1-28](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
await using lab = await temp();
await fs.mkdir(join(lab.path, "dist"));
await fs.writeFile(
  join(lab.path, "package.json"),
  JSON.stringify({
    name: "course-package-fixture",
    version: "1.0.0",
    type: "module",
    files: ["dist"],
    exports: "./dist/index.js",
  }),
);
await fs.writeFile(join(lab.path, "dist/index.js"), "export const answer=42;");
await fs.writeFile(
  join(lab.path, "secret-fixture.txt"),
  "PUBLIC TEST FIXTURE - MUST BE EXCLUDED",
);
const r = await npm(["pack", "--dry-run", "--json", "--ignore-scripts"], {
  cwd: lab.path,
});
assert.equal(r.code, 0, r.stderr);
const files = JSON.parse(r.stdout)[0].files.map((x) => x.path);
console.log(files);
assert.ok(files.includes("dist/index.js"));
assert.ok(!files.includes("secret-fixture.txt"));
console.log("allowlist verified; nothing published");
```

### Why this produces the observed result

`npm pack --dry-run --json` reveals the actual inclusion list. The assertions check both a required entry and an excluded secret-shaped public fixture; nothing is published.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Create another temporary file outside dist and verify it stays excluded. Then explain why reviewing a pack manifest is useful before publishing a real package.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-042.png)
- [Original lesson and curated constraints](lesson-brief.txt)
