# Prompt 125: Retry budgets and backoff

Category: Node.js core · Purpose: Recover from transient failures without amplifying an outage.
Implement retries for an idempotent HTTP operation with exponential backoff, jitter, a maximum attempt count, and an overall deadline. Verify permanent errors are not retried and cancellation stops pending attempts.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 125
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Transient failures consume three of four attempts; permanent errors do not retry; a pre-aborted caller starts no work.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Retries need an attempt limit, an overall time budget, a transient-error classification, and cancellation. Exponential backoff with jitter spreads retry load rather than synchronizing callers.

### Follow the implementation

From [../../shared/reliability.mjs, lines 31-49](../../shared/reliability.mjs#L31) (source excerpt; run the full application using the command above):

```javascript
export async function retry(
  operation,
  signal,
  { attempts = 4, budgetMs = 3000, rng = Math.random, sleep = delay } = {},
) {
  const deadline = AbortSignal.any([signal, AbortSignal.timeout(budgetMs)]);
  for (let n = 1; n <= attempts; n++) {
    deadline.throwIfAborted();
    try {
      return await operation({ signal: deadline });
    } catch (e) {
      deadline.throwIfAborted();
      if (!e.retryable || n === attempts) throw e;
      await sleep(rng() * Math.min(1000, 100 * 2 ** (n - 1)), undefined, {
        signal: deadline,
      });
    }
  }
}
```

From [demo.mjs, lines 14-29](demo.mjs#L14) (source excerpt; run the full application using the command above):

```javascript
assert.equal(answer, 42);
assert.equal(calls, 3);
let permanent = 0;
await assert.rejects(
  retry(async () => {
    permanent++;
    throw Error("permanent");
  }, controller.signal),
);
assert.equal(permanent, 1);
controller.abort();
await assert.rejects(
  retry(async () => {
    throw Error("must not call");
  }, controller.signal),
);
```

### Why this produces the observed result

The shared helper checks cancellation before starting work and before sleeping. The fixture uses deterministic randomness, verifies eventual success, and proves that permanent errors are attempted only once.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Mark the permanent fixture retryable and compare calls, then restore the classification. Explain why retrying a non-idempotent operation also requires a business-level duplicate policy.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-125.png)
- [Original lesson and curated constraints](lesson-brief.txt)
