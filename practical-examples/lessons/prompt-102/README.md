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

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-102.png)
- [Original lesson and curated constraints](lesson-brief.txt)
