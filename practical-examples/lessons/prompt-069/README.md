# Prompt 69: Child processes without shell interpolation

Category: Node.js core · Purpose: Run external programs with controlled arguments and resources.
Launch a helper using spawn or execFile with an argument array. Capture output, handle spawn failure and timeout, and verify an argument containing shell metacharacters remains ordinary data.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 069
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Shell-looking input is printed literally by a child process using an argument array, never interpolated.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Starting a process with an argument array preserves argument boundaries without asking a shell to interpret the text. Shell-looking punctuation then remains ordinary input to the child.

### Follow the implementation

From [demo.mjs, lines 1-6](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
const payload = "hello; & echo data";
const r = await spawnNode(["helper.mjs", payload], { timeout: 1000 });
console.log(r);
assert.equal(r.code, 0);
assert.equal(r.stdout.trim(), payload);
```

### Why this produces the observed result

The helper prints the received value, proving that it was passed literally. Shell safety does not replace validating what the child program itself is allowed to do with an argument.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Pass spaces and shell metacharacters as one argument. Verify they remain one literal value and explain how a shell-interpolated command string would change the trust boundary.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-069.png)
- [Original lesson and curated constraints](lesson-brief.txt)
