# Prompt 151: Command-Line File-Processing Tool

Category: Node.js corePurpose: Consolidate CLI design, filesystem safety, and streaming.
Learning goals: Argument parsing, stdin/stdout, UTF-8 decoding, transformations, backpressure, cancellation, exit codes, and tests.
Implementation prompt:
Build logtool, a dependency-free Node.js CLI that filters newline-delimited JSON logs and produces aggregate statistics. Support files and stdin, streamed output, configurable malformed-record handling, cancellation, and safe output replacement. Provide generated fixtures and tests demonstrating correctness and bounded memory.
Acceptance criteria:
Processes a generated 1 GiB input with correct counts and a documented memory budget substantially below input size.
Handles empty input, split UTF-8 sequences, malformed records, and an incomplete final line.
Enforces a maximum record length.
Produces clean machine-readable stdout and appropriate stderr diagnostics.
Returns meaningful exit codes and removes incomplete output after cancellation.
Suggested point: After Module 8.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 151
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The complete streaming CLI filters records, counts malformed data, handles a final line without newline, and atomically preserves an existing output on failure.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

The file-processing capstone combines argument validation, incremental UTF-8 decoding, NDJSON framing, severity filtering, and a malformed-record policy. A streaming pipeline lets a slow output apply backpressure.

### Follow the implementation

From [../../applications/logtool/main.mjs, lines 34-58](../../applications/logtool/main.mjs#L34) (source excerpt; run the full application using the command above):

```javascript
  const transform = new NDJSON({
    maxLength,
    malformed: values.malformed,
    filter: (row) =>
      typeof row === "object" &&
      row !== null &&
      (levels[row.level] ?? -1) >= levels[values.level],
  });
  const input = values.input ? createReadStream(values.input) : process.stdin;
  let output = process.stdout;
  if (values.output) {
    partial = values.output + "." + randomUUID() + ".tmp";
    output = createWriteStream(partial, { flags: "wx" });
  }
  await pipeline(input, transform, output, { signal: controller.signal });
  if (values.output) {
    await rename(partial, values.output);
    partial = undefined;
  }
  const summary = JSON.stringify({
    ...transform.counts,
    peakRssKiB: process.resourceUsage().maxRSS,
  });
  if (values.output) console.log(summary);
  else console.error(summary);
```

From [demo.mjs, lines 24-39](demo.mjs#L24) (source excerpt; run the full application using the command above):

```javascript
assert.equal(success.code, 0, success.stderr);
const summary = JSON.parse(success.stdout);
assert.equal(summary.accepted, 2);
assert.equal(summary.malformed, 1);
const before = await fs.readFile(output, "utf8");
const failure = await spawnNode([
  main,
  "--input",
  input,
  "--output",
  output,
  "--malformed",
  "fail",
]);
assert.equal(failure.code, 1);
assert.equal(await fs.readFile(output, "utf8"), before);
```

### Why this produces the observed result

A temporary output is renamed only after success, and cancellation flows through the pipeline. The demo verifies a final line without a newline and proves that failure preserves the previous completed output.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run count and fail policies against the same malformed fixture. Compare exit code, summary, destination bytes, and leftover temporary files to explain the complete CLI contract.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Run node applications/logtool/main.mjs --input FILE --output RESULT --level info --malformed count from the workspace. Use create-fixture.mjs for an optional 1 GiB benchmark; record peak RSS and select a documented memory budget rather than assuming one.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-151.png)
- [Original lesson and curated constraints](lesson-brief.txt)
