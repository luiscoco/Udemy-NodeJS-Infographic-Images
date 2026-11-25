# Prompt 10: Classes, prototypes, and this

Category: JavaScript · Purpose: Choose suitable object behavior and encapsulation.
Implement a small inventory class with a private field and a prototype method. Pass a method as a callback, reproduce a lost-`this` failure, and verify two appropriate fixes.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 010
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

An unbound method fails; binding or calling through its receiver produces 1 then 2.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A method's `this` depends on how it is called. Saving `stock.add` in a variable removes the receiver; the method then cannot access the instance's private `#count` field.

### Follow the implementation

From [demo.mjs, lines 1-13](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import assert from "node:assert/strict";
class Inventory {
  #count = 0;
  add(n = 1) {
    this.#count += n;
    return this.#count;
  }
}
const stock = new Inventory(),
  loose = stock.add;
assert.throws(() => loose(), TypeError);
console.log("TypeError for lost receiver");
console.log(stock.add.bind(stock)(), (() => stock.add())());
```

### Why this produces the observed result

Calling through `stock`, binding the method to `stock`, or wrapping the call in an arrow preserves the receiver. Private fields also enforce which instance owns the state.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Create a second inventory and compare its count with `stock`. Explain why an arrow wrapper around `stock.add()` works while invoking the detached method does not.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-010.png)
- [Original lesson and curated constraints](lesson-brief.txt)
