# Prompt 143: Serverless runtime compatibility

Category: Tooling · Purpose: Understand how hosted runtimes constrain application design.
Use AWS SAM CLI and Docker to run a minimal Lambda handler locally. Verify the platform’s supported runtime first, document any deviation from the main baseline, and test repeated invocations for accidental shared-state leakage.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 143
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual Node invocations demonstrate warm module state versus a fresh process. The supplied SAM template can be invoked locally with SAM CLI and Docker.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A serverless runtime may reuse its process for several invocations. Module-level state can therefore survive a warm call but must not be relied on across fresh environments.

### Follow the implementation

From [src/index.mjs, lines 1-5](src/index.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
let invocations = 0;
export const handler = async (event) => {
  invocations++;
  return { invocations, name: event.name ?? null };
};
```

From [demo.mjs, lines 1-14](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { handler } from "./src/index.mjs";
import { assert, spawnNode } from "../../shared/lab.mjs";
const first = await handler({ name: "course" }),
  warm = await handler({ name: "course" });
console.log({ first, warm });
assert.equal(first.invocations, 1);
assert.equal(warm.invocations, 2);
const fresh = await spawnNode([
  "--input-type=module",
  "--eval",
  "import {handler} from './src/index.mjs';console.log(JSON.stringify(await handler({name:'course'})));",
]);
assert.equal(JSON.parse(fresh.stdout).invocations, 1);
console.log("fresh process counter=1; same environment counter=2");
```

### Why this produces the observed result

The same-process handler counter increases, while a fresh child process starts at one. The SAM template is supplied for a separate deployment-style exercise; the local process test is not a cloud invocation.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Call the handler a third time, then start another fresh child. Predict both counters and explain why durable business state belongs outside a warm module variable.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Run sam build, then sam local invoke HelloFunction --event events/event.json from this folder. AWS controls the managed runtime patch; SAM execution has a separate external-tool prerequisite.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-143.png)
- [Original lesson and curated constraints](lesson-brief.txt)
