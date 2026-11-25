import { uploadApp } from "../../shared/upload.mjs";
import { assert, fs, temp } from "../../shared/lab.mjs";
await using lab = await temp();
const app = await uploadApp(lab.path);
try {
  await app.listen({ port: 0, host: "127.0.0.1" });
  for (const [size, status] of [
    [5, 200],
    [2048, 413],
  ]) {
    const form = new FormData();
    form.append("file", new Blob(["x".repeat(size)]), "unsafe-client-name.txt");
    const response = await fetch(
      "http://127.0.0.1:" + app.server.address().port + "/upload",
      { method: "POST", body: form },
    );
    console.log({ size, status: response.status, body: await response.text() });
    assert.equal(response.status, status);
  }
  assert.equal((await fs.readdir(lab.path)).length, 1);
  console.log("only complete upload retained with generated filename");
} finally {
  await app.close();
}
