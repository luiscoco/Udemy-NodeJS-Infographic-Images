# Prompt 99: JWT verification

Category: Ecosystem · Purpose: Validate bearer credentials according to a defined trust policy.
Build JWT issuance and verification using jose. Restrict algorithms and verify issuer, audience, and expiry; test tampered tokens, incorrect audiences, and expired credentials.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 099
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Signature and claim validation accepts only the expected issuer/audience/algorithm and a live expiry. No tokens are logged.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A JWT must be verified, not merely decoded. Signature verification and an explicit algorithm, issuer, audience, and expiry policy establish which token the application will accept.

### Follow the implementation

From [demo.mjs, lines 1-28](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
const key = randomBytes(32);
async function token(audience = "tasks-api", expiry = "15m") {
  return new SignJWT({ sub: "user-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("https://course.example")
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(key);
}
const options = {
  algorithms: ["HS256"],
  issuer: "https://course.example",
  audience: "tasks-api",
};
assert.equal(
  (await jwtVerify(await token(), key, options)).payload.sub,
  "user-1",
);
await assert.rejects(jwtVerify(await token("wrong"), key, options));
await assert.rejects(jwtVerify(await token("tasks-api", 0), key, options));
await assert.rejects(jwtVerify(await token(), randomBytes(32), options));
console.log(
  "valid token accepted; audience, expiry and signature failures rejected",
);
```

### Why this produces the observed result

The positive token has the expected claims; wrong audience, expiry, and signing key are rejected independently. A signed JWT is not encrypted, so its payload should not be treated as secret storage.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Change one verification option at a time and predict the rejected case. Explain why trusting an algorithm or role supplied outside the verified token would weaken the policy.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-099.png)
- [Original lesson and curated constraints](lesson-brief.txt)
