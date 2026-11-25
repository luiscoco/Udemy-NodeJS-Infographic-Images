# Prompt 143: Serverless runtime compatibility

Category: Tooling · Purpose: Understand how hosted runtimes constrain application design.
Use AWS SAM CLI and Docker to run a minimal Lambda handler locally. Verify the platform’s supported runtime first, document any deviation from the main baseline, and test repeated invocations for accidental shared-state leakage.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 143
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Actual Node invocations demonstrate warm module state versus a fresh process. The supplied SAM template can be invoked locally with SAM CLI and Docker.

## Walkthrough and experiments

Run sam build, then sam local invoke HelloFunction --event events/event.json from this folder. AWS controls the managed runtime patch; SAM execution has a separate external-tool prerequisite.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-143.png)
- [Original lesson and curated constraints](lesson-brief.txt)
