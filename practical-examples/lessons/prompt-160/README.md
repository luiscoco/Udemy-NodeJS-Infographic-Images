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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Test sharding distributes test files across separate runs, while concurrency bounds execution within a run. Reporters turn results into artifacts that a CI system can ingest.

### Follow the implementation

From [demo.mjs, lines 1-22](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode, fs } from "../../shared/lab.mjs";
for (const shard of ["1/2", "2/2"]) {
  const r = await spawnNode([
    "--test",
    "--test-shard=" + shard,
    "a.test.mjs",
    "b.test.mjs",
  ]);
  console.log(shard, r.stdout);
  assert.equal(r.code, 0, r.stderr);
}
const junit = await spawnNode([
  "--test",
  "--test-concurrency=2",
  "--test-reporter=junit",
  "--test-reporter-destination=results.xml",
  "a.test.mjs",
  "b.test.mjs",
]);
assert.equal(junit.code, 0, junit.stderr);
assert.ok((await fs.readFile("./results.xml", "utf8")).includes("<testsuites"));
console.log("JUnit artifact written; both shards passed");
```

### Why this produces the observed result

The lesson executes both shards and separately writes real JUnit XML. A successful first shard cannot stand in for the entire suite, and each shard needs isolated resources.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

List which test file appears in each shard's output. Explain why a complete CI result must require both shards to succeed and collect their failures separately.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Default isolation is process: separate child processes per test file. The two fixture tests pass under default isolation; changing to no isolation can expose shared-global coupling. The deliberate globals teach isolation, not recommended application design. --test-concurrency limits test-file processes, not the number of Worker threads or all async operations. Shards divide test files, not individual test cases, and are not guaranteed equal runtime. Run every shard against the same checkout and file set; merge CI reports as a separate step. results.xml is the JUnit artifact; don't fabricate its contents or claim execution. Each shard invocation needs its own isolated external resources. Optional globalSetup/globalTeardown uses --test-global-setup; that feature is Stability 1.0 Early development, runs per runner invocation, and is not shared across separate CI shards. Commands require a full-width panel and must remain one line each.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-160.png)
- [Original lesson and curated constraints](lesson-brief.txt)
