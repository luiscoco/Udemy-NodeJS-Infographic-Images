# Prompt 121: CPU profiling

Category: Node.js core · Purpose: Locate expensive execution before optimizing it.
Profile a CPU-heavy endpoint using --cpu-prof and inspect the generated profile. Optimize the dominant function and compare correctness and timing over repeated runs.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 121
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A real CPU profile is generated under this lesson’s profiles directory and can be opened in DevTools.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A CPU profile samples where the JavaScript runtime spends execution time. It helps distinguish an expensive function from time spent waiting for I/O.

### Follow the implementation

From [demo.mjs, lines 1-14](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { assert, fs, spawnNode } from "../../shared/lab.mjs";
await fs.mkdir("./profiles", { recursive: true });
const r = await spawnNode([
  "--cpu-prof",
  "--cpu-prof-dir=./profiles",
  "work.mjs",
]);
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
const profiles = (await fs.readdir("./profiles")).filter((x) =>
  x.endsWith(".cpuprofile"),
);
console.log("Open in DevTools:", profiles.at(-1));
assert.ok(profiles.length > 0);
```

### Why this produces the observed result

The harness launches a real process with `--cpu-prof`, checks completion, and locates the generated profile. A profile records a particular workload and is not a universal performance ranking.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Open the generated file in DevTools and locate the hot function. Change its workload and compare another profile rather than judging optimization from source appearance alone.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-121.png)
- [Original lesson and curated constraints](lesson-brief.txt)
