# Node.js practical examples — 167 lessons

Every numbered course prompt has an application folder under `lessons/prompt-001` through `lessons/prompt-167`. Each folder contains executable source, a lesson-specific walkthrough, expected behavior, the original brief, and a package script. The five complete capstones are also available under `applications/`.

## Start a lesson

Use **Node.js 26.13.1**, matching `.node-version`. From this folder:

```powershell
npm ci
npm run catalog
npm run lesson -- 001
npm run lesson -- 060
npm run lesson -- 076 --serve
```

`--serve` keeps supported Fastify lesson APIs running on loopback port 3000 after their finite checks. Most demos intentionally finish after showing their results. The persistent task API, rooms and background worker have their own entry points under `applications/`.

On the current Windows workspace, `./run-course.ps1 001` can use the isolated verified runtime in `../.tools` without changing the system-wide Node installation. On another machine configure Node with your version manager first. Runtime binaries and node_modules are not part of the source package.

Open **index.html** for a searchable lesson browser with source code, exact run commands, expected behavior and recorded output. [LEARNING-PATH.md](LEARNING-PATH.md) lists all lessons in order. Infographic links assume this folder remains next to the repository's existing output directory; the applications do not require the images to run.

## Database and queue lessons

```powershell
npm run setup
docker compose up -d db redis mongo
npm run lesson -- 086
npm run lesson -- 093
npm run lesson -- 152
npm run lesson -- 153
npm run lesson -- 154
```

Setup generates a git-ignored `.env` with fresh local credentials and never prints them. Services bind only to loopback ports 55432 (PostgreSQL), 56379 (Redis), and 57017 (MongoDB). Each PostgreSQL demo creates a uniquely named schema and removes only that schema. MongoDB/Redis fixtures use owned, uniquely named namespaces. These are disposable classroom services; do not point them at a production database.

Stop them with `docker compose stop db redis mongo`. Named data volumes remain. Read [applications/README.md](applications/README.md) and [deployment/README.md](deployment/README.md) for the standalone task API, room clients, worker, two-replica NGINX deployment and restore rehearsal.

## Validation

```powershell
npm run check
npm test
npm run validate
npm run validate:services
npm run validate:docker
node tools/validate-native-docker.mjs
npm run index
```

- `check` verifies 167 consecutive catalog entries and parses application sources, excluding the intentionally invalid parser fixture in Prompt 2.
- `test` checks meaningful stream boundaries, malformed/overlong records, queue overflow, cancellation and half-open recovery.
- `validate` executes finite self-checking demos with deadlines. Measurements and output are captured per lesson in `observed-output.txt` and centrally in `validation/report.json`.
- `--services` includes PostgreSQL/Redis/MongoDB and the Docker-based restore rehearsal. Docker services must already be running.
- `--docker` runs the image/deployment rehearsals and shuts their owned test deployment down afterward, preserving named volumes.
- Native Docker validation compiles and executes Node-API and FFI against the pinned Linux runtime. A Linux pass does not certify the Windows compiler/ABI; Windows students rebuild with their own toolchain.

**Passed means the finite demo actually exited successfully and its embedded checks passed.** It does not mean every optional experiment, remote GitHub Actions job, AWS SAM invocation or production rollout was executed. Prompt 7 remains an interactive watch/edit exercise for students; its separate finite verification harness edits a temporary imported file and observes an actual restart. Prompt 145 runs a real WASI file reader assembled from supplied WAT; the equivalent C/WASI SDK route is supplied separately and is not mislabeled as compiled locally. All evidence and unrun prerequisites are explicit in the validation records.

## How to teach each example

1. Read its README and predict the result before running it.
2. Run the numbered demo and inspect the actual output alongside the infographic.
3. Open `demo.mjs` and its supplied fixtures; shared helpers are visible under `shared/`.
4. Follow the controlled failure case. Expected failures are caught and asserted; unhandled contract failures make the demo fail.
5. Change one input or invariant and explain the new behavior. Restore the lesson before running the validation suite again.

External frameworks, databases and build tools are identified as ecosystem/tooling dependencies. Experimental Node APIs retain their labels in the lesson briefs. Lockfiles record resolved package versions. The npm audit report is recorded under validation; advisory reachability and dependency changes require review rather than blind force-upgrades.

## Compatibility findings from executable examples

- SQLite's large-integer INSERT must enable `setReadBigInts(true)` as well as the SELECT because `run()` returns `lastInsertRowid`.
- The installed OpenTelemetry SDK 3 SimpleSpanProcessor accepts `{ exporter }`, and tests flush pending exports before inspecting them.
- BullMQ 6 requires an explicitly installed Redis backend client for connection-option construction; this workspace declares ioredis.
- Migration catch-up copies all authoritative old-column values after old writers drain, including non-null stale derived values.
- Compiler diagnostics require a nonzero exit status, not one assumed numeric code across all TypeScript/npm versions.

These practical corrections are documented here without silently rewriting the existing infographic images.

The glob dependency override selects the audited 14.0.6 release. The real migration runner and native build are exercised against that resolution; no blind force-upgrade is used.
