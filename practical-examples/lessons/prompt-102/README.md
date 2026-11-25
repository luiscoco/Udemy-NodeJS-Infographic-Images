# Prompt 102: Authenticated encryption

Category: Node.js core · Purpose: Protect confidentiality while detecting tampering.
Encrypt and decrypt a small record using Web Crypto AES-GCM with a fresh nonce for each encryption. Verify round-trip output and failure after changing ciphertext, authentication data, or the key.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 102
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Authenticated encryption round-trips hello and rejects a modified ciphertext. Nonces must be unique per key.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Authenticated encryption protects confidentiality and detects tampering. The example uses an authenticated cipher and keeps its nonce, ciphertext, and authentication tag available for decryption.

### Follow the implementation

From [demo.mjs, lines 1-20](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  ),
  nonce = crypto.getRandomValues(new Uint8Array(12)),
  aad = new TextEncoder().encode("record:v1"),
  plain = new TextEncoder().encode("hello");
const options = { name: "AES-GCM", iv: nonce, additionalData: aad };
const encrypted = await crypto.subtle.encrypt(options, key, plain);
console.log(
  new TextDecoder().decode(
    await crypto.subtle.decrypt(options, key, encrypted),
  ),
);
const changed = new Uint8Array(encrypted.slice(0));
changed[0] ^= 1;
await assert.rejects(crypto.subtle.decrypt(options, key, changed));
console.log("tampered ciphertext rejected");
```

### Why this produces the observed result

The authentication check rejects altered ciphertext rather than returning plausible corrupted plaintext. A nonce must be unique for each encryption under the same key; successful round-tripping alone does not establish a safe nonce policy.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Flip a different ciphertext byte and verify decryption rejects again. Explain why storing an authentication tag is necessary and why the same key must not reuse a nonce.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-102.png)
- [Original lesson and curated constraints](lesson-brief.txt)
