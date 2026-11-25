# Prompt 82: WebSocket communication

Category: Ecosystem · Purpose: Support bidirectional communication over persistent connections.
Build a WebSocket server using ws and a native WebSocket client. Add message validation, heartbeat cleanup, and a bounded outbound-buffer policy; verify disconnected and slow clients are handled.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 082
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A native WebSocket client exchanges validated JSON with the external ws server; heartbeat and listener resources are cleaned up.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

WebSocket provides a long-lived, bidirectional message channel. Each message still needs parsing and validation, and a slow receiver can accumulate queued outbound bytes.

### Follow the implementation

From [demo.mjs, lines 3-33](demo.mjs#L3) (source excerpt; run the full application using the command above):

```javascript
const server = new WebSocketServer({
  port: 0,
  host: "127.0.0.1",
  maxPayload: 1024,
});
const timer = setInterval(() => {
  for (const client of server.clients) {
    if (client.isAlive === false) {
      client.terminate();
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, 1000);
server.on("connection", (socket) => {
  socket.isAlive = true;
  socket.on("pong", () => (socket.isAlive = true));
  socket.on("error", () => {});
  socket.on("message", (data) => {
    try {
      const value = JSON.parse(data);
      if (typeof value.text !== "string")
        return socket.close(1008, "Invalid message");
      if (socket.bufferedAmount > 65536)
        return socket.close(1013, "Slow client");
      socket.send(JSON.stringify(value));
    } catch {
      socket.close(1008, "Invalid JSON");
    }
  });
```

### Why this produces the observed result

The server caps payload size, checks message shape, observes bufferedAmount, and uses ping/pong heartbeats to detect dead peers. Cleanup closes the client, interval, and server.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Send invalid JSON and inspect the close behavior, then compare it with a JSON object lacking text. Explain why a valid connection does not imply every message is valid.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-082.png)
- [Original lesson and curated constraints](lesson-brief.txt)
