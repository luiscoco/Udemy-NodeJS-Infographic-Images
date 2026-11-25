# Prompt 84: Browser integration and CORS

Category: Ecosystem · Purpose: Understand browser access rules around an API.
Serve a small page using fastify and @fastify/static, and configure @fastify/cors for a separate allowed origin. Verify browser behavior for allowed and disallowed origins, and demonstrate that CORS does not authenticate nonbrowser clients.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 084
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The API emits its configured allow-origin value. A browser on a different origin cannot read the response even though the HTTP request can succeed.

## Walkthrough and experiments

Run --serve for the API, then run node browser.mjs in another terminal and open http://localhost:5173. The browser page demonstrates the actual browser-enforced policy.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-084.png)
- [Original lesson and curated constraints](lesson-brief.txt)
