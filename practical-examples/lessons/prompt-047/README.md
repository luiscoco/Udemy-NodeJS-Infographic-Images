# Prompt 47: File permissions and exclusive creation

Category: Node.js core · Purpose: Control access and prevent accidental overwrites.
Create a private temporary file using appropriate modes and exclusive creation flags. Verify a second creation attempt fails and explain which permission expectations differ on Windows.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 047
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Exclusive creation rejects an overwrite. Mode 0600 has POSIX semantics; Windows privacy requires ACL consideration.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Opening with `wx` combines creation with a must-not-exist condition, avoiding a separate existence-check race. The original file cannot be silently overwritten by the second open.

### Follow the implementation

From [demo.mjs, lines 1-11](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "secret.txt");
const handle = await fs.open(file, "wx", 0o600);
try {
  await handle.writeFile("public fixture only");
} finally {
  await handle.close();
}
await assert.rejects(fs.open(file, "wx", 0o600), { code: "EEXIST" });
console.log("EEXIST; original fixture intact");
```

### Why this produces the observed result

Mode `0600` requests owner-only POSIX permissions, subject to platform semantics. It does not establish Windows ACL privacy, so exclusive creation and access control are separate concerns.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Attempt the second write with `w` instead of `wx` in a disposable fixture. Explain which protection disappears and why a permission mode does not replace exclusive creation.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-047.png)
- [Original lesson and curated constraints](lesson-brief.txt)
