# Prompt 152: Database-Backed API with Authentication

Category: EcosystemPurpose: Combine API contracts, persistence, identity, and authorization.
Learning goals: Fastify, PostgreSQL, pooling, migrations, transactions, password derivation, token verification, ownership rules, and integration tests.
Implementation prompt:
Build a task-management API using fastify, pg, node-pg-migrate, and jose, with PostgreSQL persistence and core crypto.scrypt password verification. Implement registration, authentication, owner-scoped task operations, validation, pagination, and one transactional business operation. Supply integration tests for authentication failures, cross-user access, rollback, and concurrent writes.
Acceptance criteria:
A fresh database can be created through migrations.
Data survives application restart.
Missing, invalid, and expired credentials are rejected.
User A cannot access user B’s tasks.
An injected transaction failure rolls back all related changes.
Concurrent requests preserve a stated database invariant.
Passwords, signing keys, and bearer credentials do not appear in responses or logs.
Suggested point: After Module 14.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 152
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A complete task API registers/logs in real users, enforces ownership, rejects stale edits and rolls back an injected batch failure.

## Walkthrough and experiments

The standalone server, schema migration and container deployment are in applications/task-api and deployment. Use the Docker rehearsal in Prompt 155 for browser/manual HTTP access. Passwords use versioned scrypt records; bearer tokens are never printed.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-152.png)
- [Original lesson and curated constraints](lesson-brief.txt)
