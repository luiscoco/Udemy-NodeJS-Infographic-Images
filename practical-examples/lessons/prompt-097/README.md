# Prompt 97: Password derivation

Category: Node.js core · Purpose: Store password verification material appropriately.
Implement password registration and verification using asynchronous crypto.scrypt, random salts, and safe comparison. Verify correct and incorrect passwords, malformed stored records, and distinct stored values for identical passwords.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 097
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Versioned, salted scrypt records verify correctly without logging passwords or hashes.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A password verifier stores a slow, salted derivation rather than plaintext or reversible encryption. A new random salt makes equal passwords produce different stored records.

### Follow the implementation

From [../../shared/passwords.mjs, lines 1-32](../../shared/passwords.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const run = promisify(scrypt),
  options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
export async function hashPassword(password) {
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 256
  )
    throw Error("Password length must be 8..256");
  const salt = randomBytes(16).toString("hex");
  return (
    "v1:" +
    salt +
    ":" +
    (await run(password, salt, 64, options)).toString("hex")
  );
}
export async function verifyPassword(password, stored) {
  if (
    typeof password !== "string" ||
    password.length > 256 ||
    !/^v1:[0-9a-f]{32}:[0-9a-f]{128}$/.test(stored)
  )
    return false;
  const [, salt, hex] = stored.split(":");
  return timingSafeEqual(
    await run(password, salt, 64, options),
    Buffer.from(hex, "hex"),
  );
}
```

### Why this produces the observed result

The shared helper stores a version marker and salt, validates the record shape, derives the candidate with the same parameters, and uses timingSafeEqual. The work factor also consumes memory and worker-pool capacity.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Hash the same fixture a third time and compare equality without printing the records. Explain why a fast unsalted checksum would not provide the same password-guessing cost.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The fixed cost is N=131072,r=8,p=1 with a bounded maxmem setting. Each active derivation uses substantial memory; bound authentication concurrency and measure your deployment.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-097.png)
- [Original lesson and curated constraints](lesson-brief.txt)
