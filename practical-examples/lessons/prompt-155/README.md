# Prompt 155: Deployed Application with Monitoring and Graceful Shutdown

Category: ToolingPurpose: Operate an application as a complete, maintainable system.
Learning goals: Reproducible builds, CI/CD, containers, configuration, readiness, scaling, telemetry, shutdown, rollback, and recovery.
Implementation prompt:
Deliver a containerized fastify and PostgreSQL service with a BullMQ worker, using Docker Compose and GitHub Actions. Add pino, prom-client, and OpenTelemetry instrumentation with explicitly named compatible packages, plus readiness, liveness, and coordinated shutdown. Provide a deployment rehearsal that exercises load, a dependency outage, replica replacement, and rollback.
Acceptance criteria:
A clean checkout installs from the lockfile, passes checks, and builds the deployment artifact.
Containers run without application root privileges and contain no embedded credentials.
Readiness reflects startup, required dependency availability, and shutdown.
Shutdown stops new admission, handles long-lived connections, flushes telemetry, and exits within a declared deadline.
A request can be followed through structured logs and a distributed trace.
Metrics show latency and errors without unbounded labels.
Two replicas operate correctly with an explicit connection budget.
Rollback and database restoration are demonstrated with recorded results.
Suggested point: After Module 18.
The deliverable here is the roadmap and its implementation prompts. No exercises were implemented or executed in this response.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 155
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real Compose deployment serves two API replicas behind NGINX, completes a BullMQ report, exposes metrics and survives API replacement.

## Walkthrough and experiments

This integration rehearsal builds images and starts a separate local Docker project. It shuts that project down afterward while retaining named volumes. Review deployment/README.md for metrics/traces, rollback, backup and outage rehearsals.

## Requirements and validation

Execution mode: **docker**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-155.png)
- [Original lesson and curated constraints](lesson-brief.txt)
