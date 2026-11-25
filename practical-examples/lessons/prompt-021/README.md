# Prompt 21: Resource lifetime and process exit

Category: Node.js core · Purpose: Understand why a completed program sometimes remains running.
Create a script that accidentally leaves a timer and server open. Diagnose the active resources using supported process diagnostics, close them, and verify natural process termination.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 021
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Active timer/server resources appear before cleanup; the process then exits naturally. Resource names vary by platform.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A process remains alive while referenced resources still need its event loop. A listening server and repeating timer can keep an otherwise finished script running.

### Follow the implementation

From [demo.mjs, lines 1-9](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createServer } from "node:http";
import { listen, close } from "../../shared/lab.mjs";
const timer = setInterval(() => {}, 1000);
const server = createServer((q, s) => s.end("ok"));
await listen(server);
console.log(process.getActiveResourcesInfo());
clearInterval(timer);
await close(server);
console.log("closed; natural process exit");
```

### Why this produces the observed result

`getActiveResourcesInfo` exposes resource types for diagnosis; cleanup clears the interval and closes the server so Node can exit naturally. Names and extra resources depend on the platform.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Temporarily omit `clearInterval` and observe that the process remains active. Restore cleanup and explain why calling `process.exit()` would hide the resource-lifetime problem.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-021.png)
- [Original lesson and curated constraints](lesson-brief.txt)
