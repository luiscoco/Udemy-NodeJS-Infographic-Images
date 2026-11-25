# Prompt 70: Interprocess communication

Category: Node.js core · Purpose: Coordinate separate Node.js processes.
Build a parent and forked child communicating through request IDs and replies. Add request deadlines and simulate a child crash, verifying pending requests fail rather than hang.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 070
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Request IDs correlate replies; a missing reply times out and removes its pending entry.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

IPC RPC needs request identifiers because replies can arrive independently of call order. A pending map correlates each reply with the promise waiting for it.

### Follow the implementation

From [demo.mjs, lines 16-23](demo.mjs#L16) (source excerpt; run the full application using the command above):

```javascript
child.on("message", (m) => {
  const item = pending.get(m.id);
  if (item) {
    clearTimeout(item.timer);
    pending.delete(m.id);
    item.resolve(m.value);
  }
});
```

From [demo.mjs, lines 39-56](demo.mjs#L39) (source excerpt; run the full application using the command above):

```javascript
let id = 0;
function rpc(type, value, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const key = String(++id),
      timer = setTimeout(() => {
        pending.delete(key);
        reject(Error("Deadline"));
      }, timeout);
    pending.set(key, { resolve, reject, timer });
    child.send({ id: key, type, value }, (error) => {
      if (error) {
        clearTimeout(timer);
        pending.delete(key);
        reject(error);
      }
    });
  });
}
```

### Why this produces the observed result

The child readiness handshake precedes calls, and deadlines remove unanswered entries. Send errors and child exit must also reject pending work so callers do not wait forever.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the ignored call's timeout and inspect the final pending-map size. Explain why receiving a late reply after its deadline must not recreate a pending request.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-070.png)
- [Original lesson and curated constraints](lesson-brief.txt)
