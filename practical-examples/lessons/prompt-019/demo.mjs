import { scrypt } from "node:crypto";
import { promisify } from "node:util";
import { assert, spawnNode } from "../../shared/lab.mjs";
for (const size of ["2", "8"]) {
  const r = await spawnNode(["pool.mjs"], {
    env: { ...process.env, UV_THREADPOOL_SIZE: size },
  });
  console.log("threads", size, r.stdout);
  assert.equal(r.code, 0);
}
