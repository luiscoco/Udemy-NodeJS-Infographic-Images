# Prompt 165: Asymmetric Signatures & Key Formats

Generate an Ed25519 key pair, sign a message and verify it after exporting and importing the public key. Demonstrate tamper rejection and distinguish public-key formats from private-key storage and peer identity.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 165
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

true
false
ed25519

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

An asymmetric signature uses a private key to sign and a public key to verify. The verifier can detect altered bytes without receiving the signing key.

### Follow the implementation

From [demo.mjs, lines 1-16](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import {
  generateKeyPairSync,
  createPublicKey,
  sign,
  verify,
} from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const pem = publicKey.export({ type: "spki", format: "pem" });
const imported = createPublicKey(pem);
const message = Buffer.from("course:v1");
const signature = sign(null, message, privateKey);

console.log(verify(null, message, imported, signature));
console.log(verify(null, Buffer.from("tampered"), imported, signature));
console.log(imported.asymmetricKeyType);
```

### Why this produces the observed result

The example exports the public key as SPKI PEM, imports it, and verifies both original and tampered messages. Signing authenticates the message; it does not encrypt the message contents.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Export and reimport only the public key again and verify the same signature. Explain why the private key should never be included in a distributed verifier's configuration.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Ed25519 uses null as the algorithm parameter to sign/verify. A private key signs; the corresponding public key verifies. SPKI describes this public-key encoding; PKCS#8 is a private-key format. PEM is text armor, DER is binary encoding, JWK is JSON key representation. A successful verification checks bytes against the supplied key, not the real-world identity of its owner; distribute trusted public keys through an authenticated channel. Signatures do not encrypt messages and do not by themselves prevent replay. Never log or commit private keys. The ephemeral key and synchronous generation are a small lab; choose secure storage and suitable generation strategy for production. Complete the exercise: wrong public key fails, changed signature fails, format round trips and key rotation. No external package required.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-165.png)
- [Original lesson and curated constraints](lesson-brief.txt)
