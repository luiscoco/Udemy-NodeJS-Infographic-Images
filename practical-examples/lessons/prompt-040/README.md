# Prompt 40: npm workspaces

Category: Tooling · Purpose: Develop related packages in one repository.
Create npm workspaces containing a reusable library and a CLI consumer. Run targeted and repository-wide scripts, then verify a change in the library is consumed without publishing it.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 040
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two real local workspaces link without workspace:* syntax; the CLI imports the math package.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

npm workspaces link related local packages in one installation. Each package keeps its own name, exports, and dependencies, while the root declares the workspace folders.

### Follow the implementation

From [demo.mjs, lines 6-17](demo.mjs#L6) (source excerpt; run the full application using the command above):

```javascript
await fs.writeFile(
  join(lab.path, "package.json"),
  JSON.stringify({ private: true, workspaces: ["packages/*"] }),
);
await fs.writeFile(
  join(lab.path, "packages/math/package.json"),
  JSON.stringify({
    name: "@demo/math",
    version: "1.0.0",
    type: "module",
    exports: "./index.js",
  }),
```

From [demo.mjs, lines 23-43](demo.mjs#L23) (source excerpt; run the full application using the command above):

```javascript
await fs.writeFile(
  join(lab.path, "packages/cli/package.json"),
  JSON.stringify({
    name: "@demo/cli",
    version: "1.0.0",
    type: "module",
    dependencies: { "@demo/math": "1.0.0" },
  }),
);
await fs.writeFile(
  join(lab.path, "packages/cli/main.mjs"),
  "import {add} from '@demo/math';console.log(add(2,3));",
);
const installed = await npm(
  ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
  { cwd: lab.path },
);
assert.equal(installed.code, 0, installed.stderr);
const r = await spawnNode(["packages/cli/main.mjs"], { cwd: lab.path });
console.log(r.stdout);
assert.equal(r.stdout.trim(), "5");
```

### Why this produces the observed result

The generated CLI imports the math package by its package name after installation. This verifies package linking rather than bypassing the boundary with a relative source import.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the math export and update the CLI to consume it. Explain which manifest declares the CLI's dependency and which manifest declares the workspace membership.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-040.png)
- [Original lesson and curated constraints](lesson-brief.txt)
