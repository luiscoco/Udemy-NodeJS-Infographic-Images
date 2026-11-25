# Prompt 139: Health checks

Category: Node.js core · Purpose: Communicate whether an instance should receive traffic or restart.
Implement separate readiness and liveness endpoints in a Node.js service. Simulate startup, database unavailability, and shutdown, verifying readiness changes without automatically treating every dependency outage as a process failure.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 139
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Readiness changes independently of liveness. Dependency failure is injected at the pool boundary, not falsely reported as a physical database outage.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-139.png)
- [Original lesson and curated constraints](lesson-brief.txt)
