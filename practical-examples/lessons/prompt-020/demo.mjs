import { assert, delay } from "../../shared/lab.mjs";
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 30);
try {
  await delay(1000, null, { signal: controller.signal });
  assert.fail("must cancel");
} catch (e) {
  assert.equal(e.name, "AbortError");
  console.log(e.name);
} finally {
  clearTimeout(timer);
}
