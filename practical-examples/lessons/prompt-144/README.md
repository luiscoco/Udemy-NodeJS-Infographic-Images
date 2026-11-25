# Prompt 144: Single executable applications — experimental 1.1

Category: Node.js core · Purpose: Distribute a small application with its runtime.
Package a dependency-free CLI using the baseline’s built-in node --build-sea workflow. Document target-platform signing requirements and verify the executable runs without finding a separate Node.js executable on PATH.
The built-in generation workflow is available on this baseline; SEA remains in active development. Node.js v26.13.1 Documentation

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 144
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The actual single executable builds and runs with PATH emptied, demonstrating that the Node runtime is embedded.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A single executable application embeds the Node runtime and application entry into a platform-specific executable. It can start without resolving a separate node binary from PATH.

### Follow the implementation

From [demo.mjs, lines 11-25](demo.mjs#L11) (source excerpt; run the full application using the command above):

```javascript
await fs.writeFile(
  config,
  JSON.stringify({
    main: fileURLToPath(new URL("./hello.mjs", import.meta.url)),
    mainFormat: "module",
    output: binary,
  }),
);
const build = await spawnNode(["--build-sea", config]);
assert.equal(build.code, 0, build.stderr);
const run = await promisify(execFile)(binary, ["student"], {
  env: { ...process.env, PATH: "" },
});
console.log(run.stdout);
assert.equal(run.stdout.trim(), "Hello, student!");
```

### Why this produces the observed result

The demo builds into an owned temporary path and runs the executable with PATH empty. External services, platform compatibility, and any separately accessed assets remain application concerns.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the greeting argument and rerun the executable. Explain why an executable built for one operating system and architecture is not automatically portable to another.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-144.png)
- [Original lesson and curated constraints](lesson-brief.txt)
