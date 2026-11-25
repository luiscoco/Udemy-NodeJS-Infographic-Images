import { watch } from "node:fs";
import { assert, fs, temp, join, delay } from "../../shared/lab.mjs";
await using lab = await temp();
let scans = 0,
  snapshot = [],
  pending = Promise.resolve();
function reconcile() {
  pending = pending.then(async () => {
    snapshot = await fs.readdir(lab.path);
    scans++;
  });
  return pending;
}
let debounce;
const watcher = watch(lab.path, () => {
  clearTimeout(debounce);
  debounce = setTimeout(reconcile, 15);
});
watcher.on("error", (e) => console.error(e.code));
const periodic = setInterval(reconcile, 50);
try {
  await reconcile();
  await fs.writeFile(join(lab.path, "a.txt"), "one");
  await fs.writeFile(join(lab.path, "a.txt"), "two");
  await delay(150);
  await reconcile();
  assert.deepEqual(snapshot, ["a.txt"]);
  console.log({ scans, snapshot });
} finally {
  clearTimeout(debounce);
  clearInterval(periodic);
  watcher.close();
  await pending;
}
