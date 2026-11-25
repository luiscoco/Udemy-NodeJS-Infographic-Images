import { uploadApp } from "../../shared/upload.mjs";
import { assert, temp, spawnNode } from "../../shared/lab.mjs";
await using lab = await temp();
const app = await uploadApp(lab.path);
try {
  await app.listen({ port: 0, host: "127.0.0.1" });
  const r = await spawnNode(["upload-client.mjs"], {
    env: {
      ...process.env,
      UPLOAD_URL: "http://127.0.0.1:" + app.server.address().port + "/upload",
    },
  });
  console.log(r.stdout);
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(r.stdout.trim().split("\n"), ["true", "200"]);
} finally {
  await app.close();
}
