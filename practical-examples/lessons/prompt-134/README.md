# Prompt 134: Trusted code in VM contexts

Category: Node.js core · Purpose: Run trusted scripts with separate global state.
Execute a trusted expression using node:vm with a dedicated context and execution timeout. Verify global-state separation and explain why this mechanism must not be treated as secure isolation for hostile code.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 134
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Trusted code uses separate global state and the synchronous infinite-loop fixture times out. vm is not a security boundary.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-134.png)
- [Original lesson and curated constraints](lesson-brief.txt)
