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
