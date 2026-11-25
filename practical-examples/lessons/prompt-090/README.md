# Prompt 90: MongoDB document modeling

Category: Ecosystem · Purpose: Work with a document-oriented persistence model.
Build a product catalog using the mongodb driver and a local MongoDB service. Add a useful index, validate document boundaries, and verify the query plan and duplicate-key behavior.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 090
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

A unique SKU index supports an idempotent upsert; a duplicate insert is rejected and the real query plan is displayed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Document modeling combines flexible records with explicit invariants. A MongoDB collection validator restricts fields, and a unique SKU index enforces identity across concurrent writers.

### Follow the implementation

From [demo.mjs, lines 25-39](demo.mjs#L25) (source excerpt; run the full application using the command above):

```javascript
  const products = db.collection("products");
  await products.createIndex({ sku: 1 }, { unique: true });
  await products.updateOne(
    { sku: "demo-1" },
    { $setOnInsert: { price: 10 } },
    { upsert: true },
  );
  console.log(await products.findOne({ sku: "demo-1" }));
  await assert.rejects(products.insertOne({ sku: "demo-1", price: 20 }), {
    code: 11000,
  });
  console.log(
    (await products.find({ sku: "demo-1" }).explain("executionStats"))
      .executionStats,
  );
```

### Why this produces the observed result

An upsert with `$setOnInsert` inserts only when the SKU is absent. The duplicate-key case and actual explain output connect the logical rule to real database behavior.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Run the upsert again with a different insert-only price. Predict why the existing price remains, then compare `$setOnInsert` with `$set`.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **mongodb**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-090.png)
- [Original lesson and curated constraints](lesson-brief.txt)
