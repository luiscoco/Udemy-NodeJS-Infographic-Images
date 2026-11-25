# Prompt 4: Environment configuration

Category: Node.js core · Purpose: Separate configuration from application logic.
Build a configuration loader using process.env and node --env-file. Validate a port, boolean, and required secret; verify environment-variable precedence and fail before startup when configuration is invalid.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 004
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Valid configuration prints public fields. Invalid ports fail without exposing the fixture secret.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Environment variables arrive as strings. The configuration module converts `PORT` to a number, validates its range, and converts `DEBUG` by comparing with `"true"`; the string `"false"` is truthy in JavaScript.

### Follow the implementation

From [config.mjs, lines 1-7](config.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("Invalid PORT");
const d = process.env.DEBUG ?? "false";
if (!["true", "false"].includes(d) || !process.env.API_KEY?.trim())
  throw Error("Invalid configuration");
console.log({ port, debug: d === "true" });
```

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const PORT of ["3000", "0", "not-a-port"]) {
  const r = await spawnNode(["--env-file=fixture.env", "config.mjs"], {
    env: {
      ...process.env,
      PORT,
      DEBUG: "false",
      API_KEY: "public-lab-fixture",
    },
  });
  console.log({ PORT, ...r });
  assert.equal(r.code, PORT === "3000" ? 0 : 1);
}
```

### Why this produces the observed result

Validation happens before the application starts. The harness overrides the environment for each child, exercises invalid ports, and prints only public configuration fields rather than the required API key.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add `"65535"`, `"65536"`, and an empty string to the port cases. Predict the accepted boundary and explain why `Boolean(process.env.DEBUG)` would be incorrect.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-004.png)
- [Original lesson and curated constraints](lesson-brief.txt)
