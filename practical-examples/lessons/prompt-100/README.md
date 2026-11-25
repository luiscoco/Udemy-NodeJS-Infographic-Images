# Prompt 100: Resource authorization

Category: Ecosystem · Purpose: Prevent authenticated users from accessing unauthorized data.
Add owner and administrator authorization to a fastify task API. Create two users and verify one cannot read, update, or delete the other’s tasks by guessing identifiers.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 100
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real signed identities and PostgreSQL owner predicates prevent cross-user access.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-100.png)
- [Original lesson and curated constraints](lesson-brief.txt)

The separate role-aware route contrasts the owner-only capstone routes with an owner-or-admin SQL policy. Only a role from the verified JWT is trusted; a forged role header does not grant access.
