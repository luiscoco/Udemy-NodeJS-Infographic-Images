# Prompt 54: Transform streams

Category: Node.js core · Purpose: Transform data incrementally.
Build a Transform stream that converts newline-delimited JSON into filtered output. Handle records split across chunks, impose a maximum record length, and verify malformed-record behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 054
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Byte-by-byte input preserves UTF-8, filters records, and flushes the final line without a newline.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A Transform stream maintains state between incoming chunks. The NDJSON transform decodes UTF-8, extracts complete lines, parses records, filters them, and serializes accepted output.

### Follow the implementation

From [../../shared/ndjson.mjs, lines 34-61](../../shared/ndjson.mjs#L34) (source excerpt; run the full application using the command above):

```javascript
  #consume() {
    let end;
    while ((end = this.#pending.indexOf("\n")) >= 0) {
      const line = this.#pending.slice(0, end);
      this.#pending = this.#pending.slice(end + 1);
      this.#line(line);
    }
    if (this.#pending.length > this.maxLength) throw Error("Record too long");
  }
  _transform(chunk, enc, done) {
    try {
      this.#pending += this.#decoder.write(chunk);
      this.#consume();
      done();
    } catch (e) {
      done(e);
    }
  }
  _flush(done) {
    try {
      this.#pending += this.#decoder.end();
      this.#consume();
      if (this.#pending) this.#line(this.#pending);
      this.#pending = "";
      done();
    } catch (e) {
      done(e);
    }
```

From [demo.mjs, lines 5-9](demo.mjs#L5) (source excerpt; run the full application using the command above):

```javascript
const source = Buffer.from(
  '{"text":"café","level":"info"}\n{"level":"debug"}\n{"level":"info"}',
);
let output = "";
const transform = new NDJSON({ filter: (row) => row.level === "info" });
```

### Why this produces the observed result

The byte-at-a-time fixture forces split characters, and `_flush` handles the final line without a newline. The record limit is measured in UTF-16 string units here, not raw UTF-8 bytes.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Remove the trailing newline from another valid record and verify it is still emitted. Then lower the record limit and distinguish a malformed record from an overlong one.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The full Transform is supplied in shared/ndjson.mjs, including _flush. Its length budget is UTF-16 code units; byte-level input budgets are separate.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-054.png)
- [Original lesson and curated constraints](lesson-brief.txt)
