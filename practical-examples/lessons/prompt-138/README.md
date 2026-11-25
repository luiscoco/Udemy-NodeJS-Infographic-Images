# Prompt 138: Deployment configuration

Category: Tooling · Purpose: Assemble application services predictably.
Create a Docker Compose deployment for a Node.js API and PostgreSQL with persistent data and externalized configuration. Verify startup from a clean environment and persistence after replacing the application container.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 138
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The Compose stack builds, writes a task, replaces only api1, and verifies the task survives in PostgreSQL.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Deployment separates replaceable application processes from durable data. Compose starts the API alongside PostgreSQL, while named volumes keep database storage outside an API container's lifetime.

### Follow the implementation

From [../../shared/deployment-demo.mjs, lines 54-66](../../shared/deployment-demo.mjs#L54) (source excerpt; run the full application using the command above):

```javascript
    };
    response = await fetch(base + "/tasks", {
      method: "POST",
      headers,
      body: JSON.stringify({ title: "persistent Compose task" }),
    });
    assert.equal(response.status, 201);
    const task = await response.json();
    docker(["up", "-d", "--force-recreate", "--no-deps", "api1"]);
    await ready();
    response = await fetch(base + "/tasks/" + task.id, { headers });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).title, "persistent Compose task");
```

### Why this produces the observed result

The rehearsal creates a task, replaces api1, and reads the task afterward. Persistence is proved through the API rather than inferred merely from the presence of a volume declaration.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Read the replacement and verification steps in the shared rehearsal. Explain why writing task data only into an API container's writable layer would fail this test.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Run node tools/setup.mjs first. This uses deployment/compose.yaml, a separate local project from the database fixtures. Named volumes are retained during normal teardown; no docker compose down -v is issued.

## Requirements and validation

Execution mode: **docker**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-138.png)
- [Original lesson and curated constraints](lesson-brief.txt)
