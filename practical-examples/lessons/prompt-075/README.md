# Prompt 75: Clustered processes

Category: Node.js core · Purpose: Understand multiple processes serving one application.
Build a two-worker node:cluster HTTP service that returns each worker’s PID. Terminate one worker, verify controlled replacement, and demonstrate why ordinary in-memory state is not shared.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 075
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two separate processes serve a shared listening endpoint. Observed PID distribution is not required to alternate. Shutdown prevents respawn loops.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Cluster starts separate Node processes that can serve a shared listening endpoint. Each process has separate JavaScript memory, unlike shared-memory worker coordination.

### Follow the implementation

From [demo.mjs, lines 15-19](demo.mjs#L15) (source excerpt; run the full application using the command above):

```javascript
  fork();
  fork();
  cluster.on("exit", () => {
    if (!stopping && restarts++ < 1) fork();
  });
```

From [demo.mjs, lines 38-58](demo.mjs#L38) (source excerpt; run the full application using the command above):

```javascript
  } finally {
    stopping = true;
    await Promise.all(
      Object.values(cluster.workers).map(
        (w) =>
          new Promise((resolve) => {
            w.once("exit", resolve);
            w.send("shutdown");
          }),
      ),
    );
  }
} else {
  const server = createServer((q, s) => s.end(String(process.pid)));
  server.listen(0, "127.0.0.1", () =>
    process.send({ port: server.address().port, pid: process.pid }),
  );
  process.on("message", (m) => {
    if (m === "shutdown") server.close(() => process.disconnect());
  });
}
```

### Why this produces the observed result

The primary limits unexpected restarts and marks intentional shutdown before telling workers to close. Observed response PIDs can vary because load distribution is not guaranteed to alternate.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add a process-local counter to worker responses and compare values across PIDs. Explain why a shared database is needed for state that all replicas must agree on.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-075.png)
- [Original lesson and curated constraints](lesson-brief.txt)
