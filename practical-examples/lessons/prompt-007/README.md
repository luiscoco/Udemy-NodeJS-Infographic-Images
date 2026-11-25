# Prompt 7: Application watch mode

Category: Node.js core · Purpose: Shorten the edit-and-run development loop.
Create a small application run with node --watch. Change an imported module and verify automatic restart; explain the difference between ordinary watch mode and the platform restrictions of --watch-path.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 007
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Edit message.mjs in another editor: watch mode restarts and prints the changed message. Stop with Ctrl+C.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Watch mode starts a new application process when a watched module changes. It is useful during development because the next run imports the edited dependency and rebuilds its in-memory state.

### Follow the implementation

From [demo.mjs, lines 1-5](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { spawn } from "node:child_process";
const child = spawn(process.execPath, ["--watch", "main.mjs"], {
  stdio: "inherit",
});
child.on("exit", (code) => (process.exitCode = code ?? 0));
```

From [main.mjs, lines 1-2](main.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { message } from "./message.mjs";
console.log(message);
```

From [message.mjs, lines 1-1](message.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
export const message = "Hello, Node.js!";
```

### Why this produces the observed result

The launcher uses the current Node executable with `--watch` and inherits terminal output. The separate verification harness edits a temporary imported module and observes a restart; the student's interactive source remains available for editing.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Start the lesson, edit the exported message in `message.mjs`, and observe the next startup message. Explain why a module-level counter cannot retain its previous process value after restart.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Watch mode is intentionally interactive and is excluded from the unattended validator. In-memory state resets on each restart.

## Requirements and validation

Execution mode: **interactive**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-007.png)
- [Original lesson and curated constraints](lesson-brief.txt)
