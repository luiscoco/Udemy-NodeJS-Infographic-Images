import { createServer, connect, constants } from "node:http2";
import { assert, listen, close } from "../../shared/lab.mjs";
const server = createServer();
server.on("stream", (stream, headers) => {
  stream.on("error", () => {});
  stream.respond({ ":status": 200 });
  stream.end(headers[":path"]);
});
const base = await listen(server),
  session = connect(base);
session.on("error", () => {});
try {
  const complete = new Promise((resolve, reject) => {
    const request = session.request({ ":path": "/a" });
    let text = "";
    request.on("data", (c) => (text += c));
    request.on("error", reject);
    request.on("end", () => resolve(text));
    request.end();
  });
  const cancelled = session.request({ ":path": "/b" });
  cancelled.on("error", () => {});
  cancelled.close(constants.NGHTTP2_CANCEL);
  assert.equal(await complete, "/a");
  console.log("first stream completed while second was cancelled");
} finally {
  session.destroy();
  await close(server);
}
