import { setTimeout as delay } from "node:timers/promises";
export function admission({ maxActive = 8, maxQueued = 32 } = {}) {
  let active = 0,
    max = 0;
  const queue = [];
  function submit(work) {
    if (active >= maxActive && queue.length >= maxQueued)
      return Promise.reject(Error("OVERLOADED"));
    return new Promise((resolve, reject) => {
      const run = async () => {
        active++;
        max = Math.max(max, active);
        try {
          resolve(await work());
        } catch (e) {
          reject(e);
        } finally {
          active--;
          queue.shift()?.();
        }
      };
      if (active < maxActive) void run();
      else queue.push(run);
    });
  }
  return {
    submit,
    stats: () => ({ active, queued: queue.length, maxActive: max }),
  };
}
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
