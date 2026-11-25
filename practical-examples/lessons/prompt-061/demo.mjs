import { Agent, get, createServer } from "node:http";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = createServer((q, s) => s.end("ok")),
  base = await listen(server),
  agent = new Agent({ keepAlive: true, maxSockets: 2 });
function request() {
  return new Promise((resolve, reject) => {
    const req = get(base, { agent }, (res) => {
      res.resume();
      res.once("end", () => resolve(req.reusedSocket));
      res.once("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(1000, () => req.destroy(Error("Timeout")));
  });
}
try {
  const reuse = [await request(), await request()];
  console.log({ reuse });
  assert.equal(reuse[0], false);
} finally {
  agent.destroy();
  await close(server);
}
