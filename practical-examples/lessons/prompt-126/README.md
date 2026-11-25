# Prompt 126: Circuit breakers and recovery

Category: JavaScript · Purpose: Reduce repeated work against a failing dependency.
Implement a small circuit breaker around an injected asynchronous dependency. Test closed, open, and half-open transitions deterministically, including recovery and limits on probe requests.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 126
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Three failures open the breaker; an open call never reaches the dependency, and a later successful probe closes it.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A circuit breaker stops calls to a failing dependency after a threshold. After a cooldown, a single half-open probe tests recovery while other probes remain blocked.

### Follow the implementation

From [../../shared/reliability.mjs, lines 50-70](../../shared/reliability.mjs#L50) (source excerpt; run the full application using the command above):

```javascript
export function breaker(call, now = Date.now) {
  let failures = 0,
    until = 0,
    probing = false;
  return async (...args) => {
    const recovering = until !== 0;
    if (recovering && (now() < until || probing)) throw Error("OPEN");
    if (recovering) probing = true;
    try {
      const result = await call(...args);
      failures = 0;
      until = 0;
      return result;
    } catch (e) {
      if (recovering || ++failures >= 3) until = now() + 1000;
      throw e;
    } finally {
      if (recovering) probing = false;
    }
  };
}
```

From [demo.mjs, lines 14-21](demo.mjs#L14) (source excerpt; run the full application using the command above):

```javascript
for (let i = 0; i < 3; i++) await assert.rejects(call(), /down/);
await assert.rejects(call(), /OPEN/);
assert.equal(calls, 3);
now += 1001;
healthy = true;
assert.equal(await call(), "healthy");
assert.equal(await call(), "healthy");
console.log({ calls, recovered: true });
```

### Why this produces the observed result

The example injects a clock to move through closed, open, and recovered behavior without real waiting. The shared finally block releases probe ownership even if the probe fails.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Keep the dependency unhealthy after advancing the clock. Verify the failed probe reopens the breaker, then explain why allowing every caller to probe would defeat overload protection.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-126.png)
- [Original lesson and curated constraints](lesson-brief.txt)
