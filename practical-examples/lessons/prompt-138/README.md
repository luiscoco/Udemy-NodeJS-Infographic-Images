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

## Walkthrough and experiments

Run node tools/setup.mjs first. This uses deployment/compose.yaml, a separate local project from the database fixtures. Named volumes are retained during normal teardown; no docker compose down -v is issued.

## Requirements and validation

Execution mode: **docker**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-138.png)
- [Original lesson and curated constraints](lesson-brief.txt)
