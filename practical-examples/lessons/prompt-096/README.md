# Prompt 96: Secrets and configuration hygiene

Category: Node.js core · Purpose: Keep credentials out of source and accidental output.
Build startup configuration that reads secrets from environment variables or a mounted file. Validate missing values and verify sanitized diagnostics never reveal the secret or its source file contents.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 096
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A mounted-file fixture configures the app; missing configuration fails generically and never prints the secret.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Secret configuration may come from an environment value or a mounted file, but the application should validate its presence without printing it. The file location is configuration; its contents are sensitive data.

### Follow the implementation

From [config.mjs, lines 1-13](config.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { readFile } from "node:fs/promises";
try {
  const value =
    process.env.APP_SECRET ??
    (process.env.APP_SECRET_FILE
      ? await readFile(process.env.APP_SECRET_FILE, "utf8")
      : "");
  if (!value.trim()) throw Error("Missing secret");
  console.log({ secretConfigured: true });
} catch {
  console.error("Configuration unavailable");
  process.exitCode = 1;
}
```

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
await using lab = await temp();
const path = join(lab.path, "secret.txt");
await fs.writeFile(path, "public-fixture-only");
for (const valid of [true, false]) {
  const env = { ...process.env, APP_SECRET: "", APP_SECRET_FILE: "" };
  delete env.APP_SECRET;
  if (valid) env.APP_SECRET_FILE = path;
  const r = await spawnNode(["config.mjs"], { env });
  console.log({ valid, code: r.code, stdout: r.stdout, stderr: r.stderr });
  assert.equal(r.code, valid ? 0 : 1);
  assert.ok(!r.stdout.includes("public-fixture-only"));
}
```

### Why this produces the observed result

The harness provides a disposable public fixture and a missing-secret case. Generic errors and public-only output demonstrate that debugging configuration does not require logging its value.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run the missing-file path and confirm the error remains generic. Explain which information an operator needs to diagnose configuration without exposing the secret itself.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-096.png)
- [Original lesson and curated constraints](lesson-brief.txt)
