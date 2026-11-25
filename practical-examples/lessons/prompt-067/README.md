# Prompt 67: DNS and address selection

Category: Node.js core · Purpose: Diagnose hostname resolution and connectivity problems.
Compare dns.lookup with DNS record-resolution APIs for controlled examples. Handle nonexistent names and IPv4/IPv6 results, explaining why OS name resolution and DNS queries can differ.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 067
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The OS resolver reads localhost configuration. Optional --network queries real A/AAAA records without inventing addresses.

## Walkthrough and experiments

Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-067.png)
- [Original lesson and curated constraints](lesson-brief.txt)
