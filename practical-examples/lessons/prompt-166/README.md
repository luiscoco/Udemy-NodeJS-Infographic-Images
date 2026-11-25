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

## Walkthrough and experiments

Output values must use <measured> placeholders, never invented hardware or memory figures. availableParallelism estimates usable parallelism; do not substitute os.cpus().length as the recommendation. availableMemory returns free bytes available to the process, not total machine RAM. constrainedMemory returns the OS-imposed limit in bytes; 0 means unconstrained or unknown. 128 MiB reserve, 64 MiB per worker and cap 4 are illustrative policy inputs, NOT measured facts or a guaranteed safe configuration. This code only proposes a count; it starts no Workers. workers can be 0 under pressure: defer/reject work rather than force one. Memory availability changes and per-worker estimates require validation. Complete the exercise: measure whole-pool RSS, throughput, latency and event-loop delay at 1..N workers; record runtime/OS/container limits and select an explicit cap. Do not confuse a V8 heap limit with an RSS/container limit.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-166.png)
- [Original lesson and curated constraints](lesson-brief.txt)
