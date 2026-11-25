# Prompt 140: Horizontal scaling

Category: Tooling · Purpose: Run multiple instances without relying on local process state.
Run two application replicas behind an NGINX reverse proxy with shared state in Redis and PostgreSQL. Verify requests reach both replicas and calculate a database connection budget across all instances.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 140
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Two actual app instances with independent pools and a shared signing key read the same PostgreSQL task.

## Walkthrough and experiments

The example validates shared data and a connection-budget allocation. For the real two-container reverse-proxy rehearsal, run Prompt 138 or 155; deployment/nginx.conf supplies the NGINX upstream.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-140.png)
- [Original lesson and curated constraints](lesson-brief.txt)
