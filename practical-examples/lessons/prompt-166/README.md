# Prompt 166: Hardware-Aware Resource Sizing

Inspect process-available memory, OS constraints and available CPU parallelism. Calculate an explicitly bounded worker-count proposal, document its assumptions, and validate it with workload measurements instead of treating hardware counts as a performance guarantee.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 166
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual hardware/resource values are measured; policy inputs remain explicit.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Worker sizing needs both CPU and memory budgets. availableParallelism describes available parallel execution capacity, while memory measurements provide a changing resource input.

### Follow the implementation

From [demo.mjs, lines 1-16](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { availableParallelism } from "node:os";

const availableMiB = Math.floor(process.availableMemory() / 2 ** 20);
const reserveMiB = 128;
const estimatedWorkerMiB = 64;
const cpuSlots = Math.max(1, availableParallelism() - 1);
const memorySlots = Math.floor(
  Math.max(0, availableMiB - reserveMiB) / estimatedWorkerMiB,
);
const workers = Math.min(4, cpuSlots, memorySlots);

console.log({
  availableMiB,
  constrainedBytes: process.constrainedMemory(),
  workers,
});
```

### Why this produces the observed result

The policy reserves memory, estimates per-worker cost, leaves a CPU slot, and caps the count at four. Zero workers is a possible result under memory pressure and should trigger an explicit application policy rather than pretending capacity exists.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Increase estimatedWorkerMiB and recompute the policy with sample memory values. Explain which numbers are measurements and which are choices that require workload testing.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Output values must use <measured> placeholders, never invented hardware or memory figures. availableParallelism estimates usable parallelism; do not substitute os.cpus().length as the recommendation. availableMemory returns free bytes available to the process, not total machine RAM. constrainedMemory returns the OS-imposed limit in bytes; 0 means unconstrained or unknown. 128 MiB reserve, 64 MiB per worker and cap 4 are illustrative policy inputs, NOT measured facts or a guaranteed safe configuration. This code only proposes a count; it starts no Workers. workers can be 0 under pressure: defer/reject work rather than force one. Memory availability changes and per-worker estimates require validation. Complete the exercise: measure whole-pool RSS, throughput, latency and event-loop delay at 1..N workers; record runtime/OS/container limits and select an explicit cap. Do not confuse a V8 heap limit with an RSS/container limit.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-166.png)
- [Original lesson and curated constraints](lesson-brief.txt)
