# Prompt 41: Dependency inspection and security review

Category: Tooling · Purpose: Understand and review transitive dependencies.
Inspect a project with npm ls, npm explain, npm outdated, and npm audit. Review an installation script and a lockfile change, producing an evidence-based update decision rather than automatically applying forced upgrades.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 041
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual installed graph is inspected. --audit optionally requests live advisories; no fabricated vulnerability counts or force-fixes.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Dependency inspection answers what is installed; an advisory audit answers what reported vulnerabilities affect a dependency graph at the time of the query.

### Follow the implementation

From [demo.mjs, lines 1-15](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { npm } from "../../shared/npm.mjs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.includes("--audit")
  ? ["audit", "--json"]
  : ["ls", "--depth=0"];
const r = await npm(args, { cwd: root });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
if (args[0] === "ls" && r.code !== 0) process.exitCode = r.code;
console.log(
  args[0] === "audit"
    ? "Review live advisory reachability; no automatic fixes were applied."
    : "Use --audit to request a live registry advisory report.",
);
```

### Why this produces the observed result

The default command prints the real installed top-level tree. `--audit` requests live registry data without automatically modifying dependencies, so students can distinguish inspection from remediation.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run the installed-tree view and locate a package in package-lock.json. If you use the optional audit, explain why its results can change without a source-code change.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-041.png)
- [Original lesson and curated constraints](lesson-brief.txt)
