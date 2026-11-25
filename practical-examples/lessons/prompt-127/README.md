# Prompt 127: Graceful shutdown

Category: Node.js core · Purpose: Finish or terminate active work within a bounded shutdown period.
Add coordinated shutdown to a service with HTTP requests, long-lived connections, and background work. Stop admission, drain or close resources, enforce a deadline, and verify termination during active traffic.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 127
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real HTTP request drains before a real SQLite connection closes; shutdown is idempotent.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-127.png)
- [Original lesson and curated constraints](lesson-brief.txt)
