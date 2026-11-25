import { execFileSync } from "node:child_process";
import { createServer, get } from "node:https";
import { assert, fs, temp, join, listen, close } from "../../shared/lab.mjs";
await using lab = await temp();
const openssl =
  process.env.OPENSSL_EXE ??
  (process.platform === "win32"
    ? "C:/Program Files/Git/usr/bin/openssl.exe"
    : "openssl");
const run = (args) =>
  execFileSync(openssl, args, { cwd: lab.path, stdio: "pipe" });
run([
  "req",
  "-x509",
  "-newkey",
  "rsa:2048",
  "-nodes",
  "-keyout",
  "ca.key",
  "-out",
  "ca.pem",
  "-subj",
  "/CN=Course Lab CA",
  "-days",
  "1",
]);
run([
  "req",
  "-newkey",
  "rsa:2048",
  "-nodes",
  "-keyout",
  "server.key",
  "-out",
  "server.csr",
  "-subj",
  "/CN=localhost",
]);
await fs.writeFile(join(lab.path, "ext.cnf"), "subjectAltName=DNS:localhost\n");
run([
  "x509",
  "-req",
  "-in",
  "server.csr",
  "-CA",
  "ca.pem",
  "-CAkey",
  "ca.key",
  "-CAcreateserial",
  "-out",
  "server.pem",
  "-days",
  "1",
  "-extfile",
  "ext.cnf",
]);
const server = createServer(
  {
    key: await fs.readFile(join(lab.path, "server.key")),
    cert: await fs.readFile(join(lab.path, "server.pem")),
  },
  (q, s) => s.end("secure"),
);
await listen(server);
const ca = await fs.readFile(join(lab.path, "ca.pem"));
function request(trust, servername = "localhost") {
  return new Promise((resolve, reject) => {
    get(
      { host: "127.0.0.1", port: server.address().port, servername, ca: trust },
      (r) => {
        let data = "";
        r.on("data", (c) => (data += c));
        r.on("end", () => resolve(data));
      },
    ).on("error", reject);
  });
}
try {
  assert.equal(await request(ca), "secure");
  await assert.rejects(request(undefined));
  await assert.rejects(request(ca, "wrong.invalid"));
  console.log("trusted CA succeeds; untrusted CA and wrong SAN fail");
} finally {
  await close(server);
}
