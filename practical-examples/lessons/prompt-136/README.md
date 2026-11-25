# Prompt 136: Container packaging

Category: Tooling · Purpose: Deliver a reproducible application environment.
Containerize a Node.js API using Docker with an explicitly pinned runtime, npm ci, a non-root user, and a minimal runtime stage. Verify startup, signal delivery, and exclusion of source secrets and unnecessary development dependencies.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 136
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The complete two-stage Docker image builds, serves a real request as USER node, and the owned container stops.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A container image packages an application and runtime filesystem, while the container is a running instance of that image. Build and runtime stages keep build concerns separate.

### Follow the implementation

From [Dockerfile, lines 1-12](Dockerfile#L1) (source excerpt; run the full application using the command above):

```dockerfile
FROM node:26.13.1-bookworm-slim AS deps
WORKDIR /app
COPY container-package.json package.json
COPY container-package-lock.json package-lock.json
RUN npm ci --omit=dev && mkdir -p node_modules
FROM node:26.13.1-bookworm-slim
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node server.mjs ./
USER node
EXPOSE 3000
CMD ["node","server.mjs"]
```

From [demo.mjs, lines 16-30](demo.mjs#L16) (source excerpt; run the full application using the command above):

```javascript
  const port = run(["port", id, "3000/tcp"]).split(":").at(-1);
  let response;
  for (let i = 0; i < 50; i++) {
    try {
      response = await fetch("http://127.0.0.1:" + port);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  assert.equal((await response.json()).ok, true);
  console.log("non-root container replied on its assigned loopback port");
} finally {
  if (id) run(["stop", id]);
}
```

### Why this produces the observed result

The Dockerfile runs as the node user, and the harness publishes only an assigned loopback port, performs a real HTTP request, and stops its owned container in finally.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the image's USER and exposed port, then explain why EXPOSE alone does not publish a host port. Compare rebuilding an image with restarting a container.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **docker**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-136.png)
- [Original lesson and curated constraints](lesson-brief.txt)
