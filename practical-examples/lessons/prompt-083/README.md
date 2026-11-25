# Prompt 83: Server-sent events

Category: Node.js core · Purpose: Push server updates to browser clients.
Build an SSE endpoint with node:http and a browser client. Include event IDs, heartbeats, and bounded retained history; verify reconnection and an explicit response when requested history has expired.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 083
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Reconnection replays only events after Last-Event-ID; disconnect clears heartbeat state.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Server-sent events encode one-way server updates as text frames ending with a blank line. An event ID lets a reconnecting client ask for events after its last processed ID.

### Follow the implementation

From [demo.mjs, lines 8-24](demo.mjs#L8) (source excerpt; run the full application using the command above):

```javascript
const server = createServer((q, s) => {
  s.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
  });
  active++;
  const last = Number(q.headers["last-event-id"] ?? 0);
  for (const event of history.filter((x) => x.id > last))
    s.write(
      `id: ${event.id}\nevent: ready\ndata: ${JSON.stringify(event.data)}\n\n`,
    );
  const heartbeat = setInterval(() => s.write(": heartbeat\n\n"), 50);
  s.once("close", () => {
    clearInterval(heartbeat);
    active--;
  });
});
```

From [demo.mjs, lines 27-42](demo.mjs#L27) (source excerpt; run the full application using the command above):

```javascript
  const response = await fetch(base, { headers: { "Last-Event-ID": "1" } });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  while (!text.includes("\n\n")) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    if (text.length > 4096) throw Error("SSE frame budget exceeded");
  }
  console.log(text);
  assert.ok(text.includes("id: 2"));
  assert.ok(!text.includes("id: 1"));
  await reader.cancel();
  for (let i = 0; active && i < 100; i++) await delay(5);
  assert.equal(active, 0);
```

### Why this produces the observed result

The server reads Last-Event-ID, emits newer history, and clears its heartbeat when the connection closes. The client accumulates chunks until a complete frame rather than assuming a network read equals an event.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Reconnect with last ID zero and then two. Predict which history entries appear and explain why an in-memory history is only a limited replay store.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-083.png)
- [Original lesson and curated constraints](lesson-brief.txt)
