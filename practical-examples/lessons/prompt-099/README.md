# Prompt 99: JWT verification

Category: Ecosystem · Purpose: Validate bearer credentials according to a defined trust policy.
Build JWT issuance and verification using jose. Restrict algorithms and verify issuer, audience, and expiry; test tampered tokens, incorrect audiences, and expired credentials.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 099
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Signature and claim validation accepts only the expected issuer/audience/algorithm and a live expiry. No tokens are logged.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-099.png)
- [Original lesson and curated constraints](lesson-brief.txt)
