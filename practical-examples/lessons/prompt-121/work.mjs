import { createHash } from "node:crypto";
const start = performance.now();
let digest;
for (let i = 0; i < 20000; i++)
  digest = createHash("sha256")
    .update("fixture:" + i)
    .digest("hex");
console.log({ digest, elapsedMs: performance.now() - start });
