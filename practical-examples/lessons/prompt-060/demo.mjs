import { buildServer } from "../../shared/core-http.mjs";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = buildServer(),
  base = await listen(server);
try {
  for (const [path, options, status] of [
    ["/health", {}, 200],
    ["/missing", {}, 404],
    ["/echo", { method: "POST", body: '{"ok":true}' }, 200],
    ["/echo", { method: "POST", body: "{" }, 400],
    ["/echo", { method: "POST", body: "x".repeat(1025) }, 413],
  ]) {
    const response = await fetch(base + path, options);
    console.log(path, response.status, await response.text());
    assert.equal(response.status, status);
  }
} finally {
  await close(server);
}
