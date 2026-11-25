# Prompt 94: Scheduling and overlap policies

Category: Ecosystem · Purpose: Run recurring work predictably across replicas.
Configure BullMQ Job Schedulers with an explicit time zone and overlap policy. Start two scheduler instances, run a job longer than its interval, and verify the intended schedule and concurrency behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 094
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real scheduler records an explicit timezone; immediate jobs verify the global concurrency bound. Tomorrow’s scheduled execution is not claimed.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-094.png)
- [Original lesson and curated constraints](lesson-brief.txt)
