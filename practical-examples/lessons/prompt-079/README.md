# Prompt 79: REST pagination and filtering

Category: Ecosystem · Purpose: Design predictable collection endpoints.
Build a paginated collection endpoint with fastify, stable sorting, and bounded page size. Verify traversal has no duplicates for a fixed dataset and invalid cursors receive a defined error.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 079
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Cursor traversal returns each fixture ID exactly once and rejects unbounded limits.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Cursor pagination uses a stable ordering key to continue after the last item seen. Bounding the page size prevents a caller from requesting an unlimited result.

### Follow the implementation

From [demo.mjs, lines 1-35](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import Fastify from "fastify";
import assert from "node:assert/strict";
import { inspectApp } from "../../shared/fastify-lab.mjs";
const app = Fastify(),
  tasks = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: "Task " + (i + 1),
  }));
app.get("/tasks", async (q, r) => {
  const after = Number(q.query.after ?? 0),
    limit = Number(q.query.limit ?? 2);
  if (
    !Number.isSafeInteger(after) ||
    after < 0 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  )
    return r.code(400).send({ error: "Invalid cursor or limit" });
  const items = tasks.filter((x) => x.id > after).slice(0, limit);
  return { items, next: items.length ? items.at(-1).id : null };
});
await inspectApp(app, async () => {
  let after = 0,
    ids = [];
  while (true) {
    const r = (await app.inject("/tasks?after=" + after)).json();
    console.log(r);
    if (!r.items.length) break;
    ids.push(...r.items.map((x) => x.id));
    after = r.next;
  }
  assert.deepEqual(ids, [1, 2, 3, 4, 5]);
  assert.equal((await app.inject("/tasks?limit=1000")).statusCode, 400);
});
```

### Why this produces the observed result

The route validates both cursor and limit, filters IDs greater than the cursor, and returns the last returned ID as the next cursor. The harness walks until the collection is exhausted.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change the page size and verify the collected IDs remain exactly one through five with no duplicates. Explain why a real database query must use a matching ORDER BY.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-079.png)
- [Original lesson and curated constraints](lesson-brief.txt)
