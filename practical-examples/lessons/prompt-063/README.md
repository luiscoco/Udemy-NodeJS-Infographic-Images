# Prompt 63: HTTPS and TLS verification

Category: Node.js core · Purpose: Understand encrypted connections and trust configuration.
Create a local HTTPS server with certificates generated using OpenSSL. Verify trusted connections succeed and an untrusted certificate or hostname mismatch fails without disabling certificate verification.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 063
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The complete local CA/certificate lab verifies trust and hostname checks; TLS verification is never disabled.

## Walkthrough and experiments

Requires OpenSSL. Set OPENSSL_EXE if it is not on PATH; Windows defaults to the OpenSSL supplied with Git.

## Requirements and validation

Execution mode: **native-tooling**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-063.png)
- [Original lesson and curated constraints](lesson-brief.txt)
