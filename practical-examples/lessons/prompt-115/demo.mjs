import pino from "pino";
import { Writable } from "node:stream";
import assert from "node:assert/strict";
let output = "";
const sink = new Writable({
  write(c, e, done) {
    output += c;
    done();
  },
});
const log = pino(
  {
    redact: { paths: ["password", "req.headers.authorization"], remove: true },
  },
  sink,
).child({ requestId: "req-001" });
log.info(
  {
    password: "public-demo-password",
    req: { headers: { authorization: "Bearer public-demo-token" } },
    action: "login",
  },
  "request",
);
log.error({ err: Error("fixture failure") }, "failed");
console.log(output);
assert.ok(!output.includes("public-demo-password"));
assert.ok(!output.includes("public-demo-token"));
assert.equal(JSON.parse(output.split("\n")[0]).requestId, "req-001");
