# Prompt 122: Memory leaks and heap analysis

Category: Node.js core · Purpose: Distinguish retained objects from normal allocation activity.
Create a controlled leak caused by a growing cache or retained listener. Compare memory measurements and heap evidence before and after fixing ownership, avoiding claims based on one memory sample.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 122
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The unbounded cache retains 80000 entries while the bounded cache retains 1000; heap usage is measured rather than assumed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A memory leak can come from references that remain reachable longer than intended. A cache that keeps every distinct key grows even if garbage collection runs correctly.

### Follow the implementation

From [cache.mjs, lines 1-17](cache.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
const cache = new Map(),
  leak = process.argv.includes("--leak");
for (let batch = 0; batch < 8; batch++) {
  for (let i = 0; i < 10000; i++) {
    const key = batch * 10000 + i;
    cache.set(key, { label: "x".repeat(100), key });
    if (!leak && cache.size > 1000) cache.delete(cache.keys().next().value);
  }
  global.gc?.();
  console.log(
    JSON.stringify({
      batch,
      size: cache.size,
      heapUsed: process.memoryUsage().heapUsed,
    }),
  );
}
```

From [demo.mjs, lines 1-8](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const args of [[], ["--leak"]]) {
  const r = await spawnNode(["--expose-gc", "cache.mjs", ...args]);
  console.log(args.length ? "unbounded" : "bounded", r.stdout);
  assert.equal(r.code, 0, r.stderr);
  const rows = r.stdout.trim().split("\n").map(JSON.parse);
  assert.equal(rows.at(-1).size, args.length ? 80000 : 1000);
}
```

### Why this produces the observed result

The fixture compares retained entry counts in unbounded and bounded caches and measures heap usage. Forcing GC in a diagnostic child does not make reachable cache entries disappear.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the bounded capacity and observe its final entry count. Explain why calling GC is not a substitute for an eviction policy.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-122.png)
- [Original lesson and curated constraints](lesson-brief.txt)
