# Prompt 160: Test Execution at Scale

Run multiple test files with process isolation and bounded concurrency. Split the same discovered file set across CI shards, produce a JUnit artifact, and explain the scope of global fixtures and shared resources.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 160
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The two real test files execute in separate CI shards and a JUnit artifact is generated.

## Walkthrough and experiments

Default isolation is process: separate child processes per test file. The two fixture tests pass under default isolation; changing to no isolation can expose shared-global coupling. The deliberate globals teach isolation, not recommended application design. --test-concurrency limits test-file processes, not the number of Worker threads or all async operations. Shards divide test files, not individual test cases, and are not guaranteed equal runtime. Run every shard against the same checkout and file set; merge CI reports as a separate step. results.xml is the JUnit artifact; don't fabricate its contents or claim execution. Each shard invocation needs its own isolated external resources. Optional globalSetup/globalTeardown uses --test-global-setup; that feature is Stability 1.0 Early development, runs per runner invocation, and is not shared across separate CI shards. Commands require a full-width panel and must remain one line each.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-160.png)
- [Original lesson and curated constraints](lesson-brief.txt)
