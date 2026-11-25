import { createServer } from "node:http";
import { Database } from "node:sqlite";
import { assert, listen, close, delay } from "../../shared/lab.mjs";
const db = new Database(":memory:");
let stopping = false;
const timer = setInterval(() => {}, 1000);
let entered;
const started = new Promise((r) => (entered = r));
const server = createServer(async (q, s) => {
  entered();
  await delay(30);
  s.end("finished");
});
const base = await listen(server),
  request = fetch(base).then((r) => r.text());
await started;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  clearInterval(timer);
  await close(server);
  db.close();
}
await shutdown();
assert.equal(await request, "finished");
await shutdown();
assert.throws(() => db.exec("SELECT 1"));
console.log(
  "in-flight request drained, producer stopped, database closed, repeated shutdown ignored",
);
