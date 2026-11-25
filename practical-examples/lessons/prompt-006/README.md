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

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-006.png)
- [Original lesson and curated constraints](lesson-brief.txt)
