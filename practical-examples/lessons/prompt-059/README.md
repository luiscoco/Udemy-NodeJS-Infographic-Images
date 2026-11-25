# Prompt 59: URLs and query parameters

Category: Node.js core · Purpose: Construct and interpret URLs correctly.
Build a URL utility using WHATWG URL and URLSearchParams. Test repeated parameters, encoded characters, relative URLs, and invalid input without manually concatenating query strings.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 059
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Repeated query values, percent encoding and relative resolution are shown without making a network request.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

URL and URLSearchParams model structured addresses and query data. Appending the same key twice preserves multiple values instead of silently overwriting the first one.

### Follow the implementation

From [demo.mjs, lines 1-11](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const url = new URL("/search", "https://example.org");
url.searchParams.append("tag", "node js");
url.searchParams.append("tag", "streams");
console.log(
  url.searchParams.getAll("tag"),
  url.href,
  new URL("../docs", "https://example.org/course/one").href,
);
assert.deepEqual(url.searchParams.getAll("tag"), ["node js", "streams"]);
assert.throws(() => new URL("not a URL"), TypeError);
```

### Why this produces the observed result

URL serialization handles percent encoding and relative resolution. Constructing a URL object does not send a request; it only validates and represents an address.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Use `set` instead of the second `append` and compare `getAll`. Explain why concatenating raw user text into a query string can change its meaning.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-059.png)
- [Original lesson and curated constraints](lesson-brief.txt)
