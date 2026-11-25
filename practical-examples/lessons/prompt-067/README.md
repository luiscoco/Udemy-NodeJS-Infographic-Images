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

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

DNS lookup and DNS record queries answer different questions. OS lookup can use local host configuration, while explicit A or AAAA queries ask the configured DNS service for records.

### Follow the implementation

From [demo.mjs, lines 1-17](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { lookup, resolve4, resolve6 } from "node:dns/promises";
console.log("OS localhost lookup:", await lookup("localhost", { all: true }));
if (process.argv.includes("--network"))
  for (const [name, resolve] of [
    ["A", resolve4],
    ["AAAA", resolve6],
  ]) {
    try {
      console.log(name, await resolve("example.org"));
    } catch (e) {
      console.log(e.code);
    }
  }
else
  console.log(
    "Use --network for live DNS record queries; addresses depend on your resolver.",
  );
```

### Why this produces the observed result

The default localhost exercise works without public DNS. Optional network queries are separate so changing external records are not mistaken for fixed fixture output.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run the localhost path and explain why its answer can come from a hosts file. If you use the optional network mode, compare record families without hard-coding returned addresses.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-067.png)
- [Original lesson and curated constraints](lesson-brief.txt)
