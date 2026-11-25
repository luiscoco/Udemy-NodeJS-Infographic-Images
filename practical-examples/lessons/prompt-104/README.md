# Prompt 104: Abuse and resource controls

Category: Ecosystem · Purpose: Limit resource consumption by expensive requests.
Add @fastify/rate-limit to a fastify API with body limits and execution deadlines. Verify rejection behavior and configure trusted proxies explicitly so forged forwarding headers cannot bypass the chosen policy.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 104
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual rate-limit plugin enforces 20 requests per window and the body cap rejects a separate oversized request.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-104.png)
- [Original lesson and curated constraints](lesson-brief.txt)
