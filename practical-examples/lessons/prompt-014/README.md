# Prompt 14: Unicode and regular expressions

Category: JavaScript · Purpose: Process real-world text without assuming one character equals one byte.
Build a Unicode-aware identifier validator and text-normalization example. Test accented characters, combining marks, and emoji; explain the distinction between code units, code points, and encoded bytes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 014
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Normalization equates canonical text; the emoji occupies 2 UTF-16 units, 1 code point, and 4 UTF-8 bytes.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

JavaScript strings use UTF-16 code units; a code point and its UTF-8 encoding can have different lengths. The emoji example makes the difference visible rather than treating all length measurements as interchangeable.

### Follow the implementation

From [demo.mjs, lines 1-10](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
const valid = (s) =>
  /^[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*$/u.test(s.normalize("NFC"));
const a = "café",
  b = "cafe\u0301",
  face = "😀";
console.log(a === b, a.normalize("NFC") === b.normalize("NFC"));
console.log(face.length, [...face].length, Buffer.byteLength(face));
console.log(valid("café"), valid("😀"));
assert.equal(a.normalize("NFC"), b.normalize("NFC"));
```

### Why this produces the observed result

Unicode normalization makes canonically equivalent text comparable. The Unicode-aware identifier expression uses character properties, while normalization does not make arbitrary input a valid identifier.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Replace the emoji with an accented letter and compare `.length`, spread length, and byte length. Then compare composed and decomposed accented text before and after NFC normalization.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-014.png)
- [Original lesson and curated constraints](lesson-brief.txt)
