# Prompt 149: Built-in benchmark runner — experimental 1.0, Node.js 26.9+

Category: Node.js core · Purpose: Explore structured runtime benchmarking.
Use node:bench with its required experimental flag to compare two equivalent implementations. Include warmup and repeated measurements, verify equal outputs, and report variability instead of declaring a winner from one sample.
The benchmark runner was added in Node.js 26.9 and is in early development. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 149
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual experimental benchmark runner measures two equivalent string operations. Results depend on runtime and hardware.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A benchmark must compare operations that produce the same result and define which region is timed. Warmup and repeated samples reduce some measurement noise without removing all runtime effects.

### Follow the implementation

From [compare.mjs, lines 1-18](compare.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { bench, suite } from "node:bench";
const parts = Array.from({ length: 1000 }, (_, i) => `item${i}`),
  expected = parts.join(",");
suite("join strings", () => {
  bench("Array.join", { samples: 30, warmup: 10 }, (b) => {
    b.start();
    const result = parts.join(",");
    b.end(1);
    if (result !== expected) throw Error("join mismatch");
  });
  bench("concatenation loop", { samples: 30, warmup: 10 }, (b) => {
    b.start();
    let result = parts[0];
    for (let i = 1; i < parts.length; i++) result += `,${parts[i]}`;
    b.end(1);
    if (result !== expected) throw Error("loop mismatch");
  });
});
```

### Why this produces the observed result

Each benchmark validates its result outside the timed region and reports measurements from the experimental built-in runner. The result applies to this workload and hardware, not all string construction.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the number of parts and compare another run. Explain why a faster implementation that produces different separators would not be a valid optimization.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-149.png)
- [Original lesson and curated constraints](lesson-brief.txt)
