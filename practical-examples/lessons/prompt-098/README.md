# Prompt 98: Cookie sessions and CSRF

Category: Ecosystem · Purpose: Authenticate browser sessions with appropriate request protection.
Build a cookie-session example using fastify, @fastify/secure-session, and @fastify/csrf-protection. Verify cookie settings, rejected CSRF attempts, expiration, and the revocation limitations of a stateless session design.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 098
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real session and CSRF plugins reject the missing token and accept the matching one. Tokens and keys are not printed.

## Walkthrough and experiments

This is in-process HTTP injection for behavior verification. A browser deployment requires HTTPS for the Secure cookie. Expiry and per-user revocation policy need dedicated deployment tests.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-098.png)
- [Original lesson and curated constraints](lesson-brief.txt)
