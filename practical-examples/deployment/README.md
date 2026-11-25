# Local deployment rehearsal

From practical-examples:

```powershell
node tools/setup.mjs
docker compose --env-file .env -f deployment/compose.yaml up -d --build
```

The API is at http://127.0.0.1:58080. Register using POST /register with email/password, login using POST /login, then send the returned Bearer token to /tasks and /reports. POST /reports returns 202 and a report ID; GET /reports/:id eventually returns complete with a result. No real account credentials are needed. This is a local teaching deployment.

Two API replicas each cap their pg pool at 10, the worker caps its pool at 5, and the one-shot migrator uses 1. Allocate at least those connections plus administrative headroom; this is configuration arithmetic, not a measurement. NGINX does not provide a strict alternating-response contract.

Readiness requires PostgreSQL and becomes 503 while stopping. Redis availability is required for worker delivery but the API can persist requests into its transactional outbox while Redis is unavailable. Rehearse a dependency outage with docker compose --env-file .env -f deployment/compose.yaml stop db and restore it with up -d db. Liveness and readiness have separate meanings.

Stop with docker compose --env-file .env -f deployment/compose.yaml down. Named data volumes remain. Do not use down -v unless intentionally deleting this isolated classroom database. API replacement uses up -d --force-recreate --no-deps api1.

/metrics exposes low-cardinality route/status metrics. prometheus.yml scrapes each replica separately instead of treating NGINX as one process. JSON request logs carry the same traceId exported by the OpenTelemetry console exporter. For a production collector, configure a compatible OTLP exporter and deployment-specific authentication; no external endpoint is silently enabled.

Shutdown stops admission, drains HTTP/jobs, closes pg/Redis, then flushes telemetry with a 10-second deadline below the 20-second Compose grace period. Repeat POST /reports with the same Idempotency-Key to demonstrate per-owner idempotency. Failed jobs remain visible for inspection. The worker is bounded at concurrency 2; one-shot retries have an explicit attempt budget.

Before a patch upgrade run the complete lesson tests on the new runtime, rebuild the immutable image, canary it and retain the previous artifact. Roll back application code while keeping additive database changes until the rollback window closes. Prompt 142 supplies an actual separate-database backup/restore rehearsal; record your own restore time and recovery target.
