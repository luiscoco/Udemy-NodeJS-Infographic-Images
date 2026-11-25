# Prompt 153: Real-Time Collaboration Application

Category: EcosystemPurpose: Manage persistent connections and recoverable shared state.
Learning goals: WebSockets, authorization, connection cleanup, replay, slow-client policies, and multi-instance communication.
Implementation prompt:
Build a room-based collaboration application using fastify, ws, pg, and redis, with PostgreSQL message history and Redis live fan-out. Authenticate room access, assign persistent event IDs, and support reconnecting clients through history-based resynchronization. Demonstrate operation across two application instances with bounded per-client buffering.
Acceptance criteria:
At least three clients communicate through two server instances.
Unauthorized room subscriptions fail.
Reconnection follows a documented replay or resynchronization policy.
Missed events can be recovered from durable history.
Slow clients cannot create unlimited outbound buffering.
Disconnecting releases listeners, timers, and connection state.
Suggested point: After Module 15.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 153
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Three actual clients communicate across two server instances; an offline client replays a missed event from PostgreSQL and an unauthorized upgrade is rejected.

## Walkthrough and experiments

The implementation includes bounded per-client output/replay buffers, heartbeat cleanup and per-room subscription cleanup. A session-level PostgreSQL advisory lock serializes each room’s durable insertion and Redis publication across instances. Replay is capped at 100 events; larger gaps explicitly require snapshot resynchronization instead of silently losing history. The test client uses an Authorization header; a browser deployment needs an authenticated upgrade-ticket flow.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-153.png)
- [Original lesson and curated constraints](lesson-brief.txt)
