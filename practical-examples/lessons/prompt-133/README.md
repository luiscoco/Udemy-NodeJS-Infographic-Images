# Prompt 133: Module compile caching

Category: Node.js core · Purpose: Evaluate startup optimization with evidence.
Enable the stable module compile cache for a CLI with several modules. Compare cold and repeated startup, report cache status, and verify the application still works when caching is unavailable.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 133
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Cache status and full-process startup times are measured. Caching does not cache exported business results or guarantee a speedup.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

The module compile cache can reuse compilation work across processes. It does not cache a function's business result or preserve the old process's module variables.

### Follow the implementation

From [cache.mjs, lines 1-3](cache.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { enableCompileCache } from "node:module";
console.log(JSON.stringify(enableCompileCache("./.compile-cache")));
await import("./cli.mjs");
```

From [demo.mjs, lines 1-15](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, spawnNode } from "../../shared/lab.mjs";
await fs.mkdir("./.compile-cache", { recursive: true });
for (const phase of ["cold", "warm", "disabled"]) {
  const start = performance.now();
  const env = { ...process.env };
  if (phase === "disabled") env.NODE_DISABLE_COMPILE_CACHE = "1";
  const r = await spawnNode(["cache.mjs"], { env });
  console.log({
    phase,
    elapsedMs: performance.now() - start,
    output: r.stdout,
  });
  assert.equal(r.code, 0, r.stderr);
  assert.ok(r.stdout.includes("42"));
}
```

### Why this produces the observed result

The harness measures cold, warm, and disabled child runs while checking the same answer. Startup timings include process overhead and filesystem effects, so the example does not promise a speedup.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Modify the module source and compare cache status and output on the next run. Explain why correct invalidation must take precedence over reusing old compiled code.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-133.png)
- [Original lesson and curated constraints](lesson-brief.txt)
