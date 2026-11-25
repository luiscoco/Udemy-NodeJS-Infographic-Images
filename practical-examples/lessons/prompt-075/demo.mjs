import cluster from "node:cluster";
import { createServer } from "node:http";
import assert from "node:assert/strict";
if (cluster.isPrimary) {
  let stopping = false,
    restarts = 0;
  const ready = [];
  function fork() {
    const w = cluster.fork();
    w.on("message", (m) => {
      if (m.port) ready.push(m);
    });
    return w;
  }
  fork();
  fork();
  cluster.on("exit", () => {
    if (!stopping && restarts++ < 1) fork();
  });
  try {
    const deadline = Date.now() + 5000;
    while (ready.length < 2) {
      if (Date.now() > deadline) throw Error("Workers did not start");
      await new Promise((r) => setTimeout(r, 10));
    }
    const pids = new Set();
    for (let i = 0; i < 8; i++) {
      const r = await fetch("http://127.0.0.1:" + ready[0].port);
      pids.add(await r.text());
    }
    console.log(
      "Observed PIDs:",
      [...pids],
      "workers:",
      Object.keys(cluster.workers).length,
    );
    assert.equal(Object.keys(cluster.workers).length, 2);
  } finally {
    stopping = true;
    await Promise.all(
      Object.values(cluster.workers).map(
        (w) =>
          new Promise((resolve) => {
            w.once("exit", resolve);
            w.send("shutdown");
          }),
      ),
    );
  }
} else {
  const server = createServer((q, s) => s.end(String(process.pid)));
  server.listen(0, "127.0.0.1", () =>
    process.send({ port: server.address().port, pid: process.pid }),
  );
  process.on("message", (m) => {
    if (m === "shutdown") server.close(() => process.disconnect());
  });
}
