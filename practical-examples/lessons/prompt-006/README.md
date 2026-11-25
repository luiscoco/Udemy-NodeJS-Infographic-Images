# Prompt 6: Interactive terminal input

Category: Node.js core · Purpose: Support interactive workflows without hanging automation.
Create a confirmation-based CLI using node:readline/promises. Handle cancellation and close the interface; verify that piped input or a noninteractive flag avoids waiting indefinitely for a terminal response.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 006
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

--yes confirms; piped input is deliberately rejected instead of hanging for a TTY.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Interactive input requires a terminal and a clear cancellation path. The application checks `stdin.isTTY` before asking a question and provides `--yes` for automated execution.

### Follow the implementation

From [ask.mjs, lines 1-24](ask.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { createInterface } from "node:readline/promises";
if (process.argv.includes("--yes")) console.log("Confirmed");
else if (!process.stdin.isTTY) {
  console.error("Noninteractive: use --yes");
  process.exitCode = 1;
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const abort = new AbortController();
  rl.on("SIGINT", () => abort.abort());
  try {
    console.log(
      /^y(es)?$/i.test(
        await rl.question("Continue? [y/N] ", { signal: abort.signal }),
      )
        ? "Confirmed"
        : "Cancelled",
    );
  } catch (e) {
    if (e.name !== "AbortError") throw e;
    console.log("Cancelled");
  } finally {
    rl.close();
  }
}
```

### Why this produces the observed result

The readline interface owns terminal resources, so `finally` closes it. An abort signal lets Ctrl+C cancel the question. Piped input is deliberately rejected by this application rather than treated as an interactive terminal.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run `ask.mjs` directly in a terminal, answer `n`, then try Ctrl+C. Compare those paths with the demo's noninteractive `--yes` and piped-input cases.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-006.png)
- [Original lesson and curated constraints](lesson-brief.txt)
