# Prompt 164: Recovering Asynchronous Context

Demonstrate context loss at a deferred callback boundary. Capture context with AsyncLocalStorage.bind() and snapshot(), verify concurrent request IDs stay separate, and design a legacy callback adapter using AsyncResource when required.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 164
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

undefined
A
A

## Walkthrough and experiments

bind() and snapshot() are stable on the course baseline. run() scopes the store; calling plain later outside the original context sees undefined. bind captures execution context for a specific function; snapshot returns a runner that invokes supplied functions in captured context. Captured context is a reference to the store, not a deep clone of its values. This example models a callback boundary; ordinary supported promises/timers already preserve context. For custom callback adapters or worker-pool integrations, create AsyncResource in the intended context, use runInAsyncScope and call emitDestroy when owned work is complete. Do not claim arbitrary callbacks or worker-thread messages automatically preserve context. Complete the exercise: overlapping A/B callbacks, integration with a context-losing API, cleanup and request-data retention tests.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-164.png)
- [Original lesson and curated constraints](lesson-brief.txt)
