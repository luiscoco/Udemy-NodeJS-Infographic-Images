# Prompt 92: Pub/Sub versus durable streams

Category: Ecosystem · Purpose: Choose messaging behavior according to delivery requirements.
Use the redis package to compare Pub/Sub with Redis Streams consumer groups. Disconnect a consumer, publish messages, reconnect, and verify the different recovery and acknowledgment behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 092
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Pub/Sub delivers only to a live subscriber; the retained stream is read through a consumer group and acknowledged.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-092.png)
- [Original lesson and curated constraints](lesson-brief.txt)
