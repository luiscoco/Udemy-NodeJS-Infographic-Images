# Prompt 94: Scheduling and overlap policies

Category: Ecosystem · Purpose: Run recurring work predictably across replicas.
Configure BullMQ Job Schedulers with an explicit time zone and overlap policy. Start two scheduler instances, run a job longer than its interval, and verify the intended schedule and concurrency behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 094
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The real scheduler records an explicit timezone; immediate jobs verify the global concurrency bound. Tomorrow’s scheduled execution is not claimed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A schedule needs an explicit timezone, and repeated work needs a defined overlap policy. A per-worker concurrency setting differs from a queue-wide concurrency limit.

### Follow the implementation

From [demo.mjs, lines 17-38](demo.mjs#L17) (source excerpt; run the full application using the command above):

```javascript
const second = new Worker(lab.name, processor, {
  connection: lab.connection,
  concurrency: 2,
});
second.on("error", () => {});
try {
  await second.waitUntilReady();
  await lab.queue.upsertJobScheduler(
    "nightly-report",
    { pattern: "0 0 9 * * *", tz: "Europe/Madrid" },
    { name: "generate", data: { reportId: "daily" } },
  );
  await lab.queue.setGlobalConcurrency(1);
  console.log(await lab.queue.getJobSchedulers());
  const jobs = await Promise.all(
    [1, 2, 3, 4].map((i) => lab.queue.add("immediate", { i })),
  );
  await Promise.all(
    jobs.map((job) => job.waitUntilFinished(lab.events, 10000)),
  );
  assert.equal(max, 1);
  console.log("maximum active jobs across two workers:", max);
```

### Why this produces the observed result

The demo registers a Madrid schedule and runs immediate jobs across two workers with global concurrency one. It verifies the overlap bound without claiming that tomorrow's scheduled run has occurred.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Raise the global bound and compare maximum active work. Explain why giving each of two workers concurrency one still permits two simultaneous jobs without a global policy.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **redis**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-094.png)
- [Original lesson and curated constraints](lesson-brief.txt)
