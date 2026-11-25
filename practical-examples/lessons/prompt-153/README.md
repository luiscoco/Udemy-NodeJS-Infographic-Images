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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Real-time collaboration needs both immediate fan-out and durable recovery. PostgreSQL stores events before Redis notifies live replicas, and a reconnecting client resumes from its last event ID.

### Follow the implementation

From [../../applications/rooms/server.mjs, lines 67-91](../../applications/rooms/server.mjs#L67) (source excerpt; run the full application using the command above):

```javascript
  async function publish(room, payload) {
    const client = await pool.connect();
    try {
      await client.query("SELECT pg_advisory_lock(hashtext($1))", [
        namespace + room,
      ]);
      const row = (
        await client.query(
          "INSERT INTO room_events(room_id,payload) VALUES($1,$2) RETURNING id,payload",
          [room, payload],
        )
      ).rows[0];
      await publisher.publish(
        namespace + room,
        JSON.stringify({ type: "event", ...row }),
      );
    } finally {
      try {
        await client.query("SELECT pg_advisory_unlock(hashtext($1))", [
          namespace + room,
        ]);
      } finally {
        client.release();
      }
    }
```

From [demo.mjs, lines 65-75](demo.mjs#L65) (source excerpt; run the full application using the command above):

```javascript
  b.send(JSON.stringify({ type: "message", text: "missed while offline" }));
  const live = await Promise.all(second);
  const reconnect = new WebSocket(servers[1].url + "/room-a", {
    headers: { authorization: "Bearer " + token },
  });
  reconnect.on("error", () => {});
  clients.push(reconnect);
  await wait(reconnect, (m) => m.type === "ready");
  const replay = wait(reconnect, (m) => m.type === "event");
  reconnect.send(JSON.stringify({ type: "resume", after: last }));
  assert.equal((await replay).id, live[0].id);
```

### Why this produces the observed result

Room membership comes from a verified ticket. The server bounds replay and slow-client buffers and orders publication per room; Redis Pub/Sub alone cannot recover an offline client's missing history.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Follow the offline/reconnect sequence and compare live and replayed event IDs. Explain why the resume cursor should advance only after the client has processed an event.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The implementation includes bounded per-client output/replay buffers, heartbeat cleanup and per-room subscription cleanup. A session-level PostgreSQL advisory lock serializes each room’s durable insertion and Redis publication across instances. Replay is capped at 100 events; larger gaps explicitly require snapshot resynchronization instead of silently losing history. The test client uses an Authorization header; a browser deployment needs an authenticated upgrade-ticket flow.

## Requirements and validation

Execution mode: **postgres+redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-153.png)
- [Original lesson and curated constraints](lesson-brief.txt)
