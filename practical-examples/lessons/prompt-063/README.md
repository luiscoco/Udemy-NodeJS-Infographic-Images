# Prompt 63: HTTPS and TLS verification

Category: Node.js core · Purpose: Understand encrypted connections and trust configuration.
Create a local HTTPS server with certificates generated using OpenSSL. Verify trusted connections succeed and an untrusted certificate or hostname mismatch fails without disabling certificate verification.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 063
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The complete local CA/certificate lab verifies trust and hostname checks; TLS verification is never disabled.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

TLS validates both certificate trust and the requested server identity. The lab creates its own CA and a certificate whose subject alternative name matches the intended local hostname.

### Follow the implementation

From [demo.mjs, lines 65-82](demo.mjs#L65) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

A trusted CA alone cannot make a wrong hostname valid. The positive and negative requests keep verification enabled, separating trust failures from identity mismatches.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Compare the trusted-host request with the wrong-host case. Explain why disabling certificate verification would erase the two concepts the exercise is intended to teach.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Requires OpenSSL. Set OPENSSL_EXE if it is not on PATH; Windows defaults to the OpenSSL supplied with Git.

## Requirements and validation

Execution mode: **native-tooling**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-063.png)
- [Original lesson and curated constraints](lesson-brief.txt)
