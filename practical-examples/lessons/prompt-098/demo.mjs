import Fastify from "fastify";
import secureSession from "@fastify/secure-session";
import csrf from "@fastify/csrf-protection";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
const app = Fastify();
await app.register(secureSession, {
  key: randomBytes(32),
  expiry: 3600,
  cookie: { path: "/", httpOnly: true, secure: true, sameSite: "lax" },
});
await app.register(csrf, { sessionPlugin: "@fastify/secure-session" });
app.get("/session", async (q, r) => {
  q.session.set("user", "user-a");
  return { token: await r.generateCsrf() };
});
app.post(
  "/transfer",
  {
    onRequest: [
      async (q, r) => {
        if (!q.session.get("user"))
          return r.code(401).send({ error: "Unauthorized" });
      },
      app.csrfProtection,
    ],
  },
  async () => ({ accepted: true }),
);
try {
  const session = await app.inject("/session");
  const cookie = session.cookies
      .map((c) => c.name + "=" + encodeURIComponent(c.value))
      .join("; "),
    token = session.json().token;
  assert.ok(session.headers["set-cookie"].includes("Secure"));
  const missing = await app.inject({
    method: "POST",
    url: "/transfer",
    headers: { cookie },
  });
  const valid = await app.inject({
    method: "POST",
    url: "/transfer",
    headers: { cookie, "csrf-token": token },
  });
  assert.equal(missing.statusCode, 403);
  assert.equal(valid.statusCode, 200);
  console.log(
    "secure encrypted session cookie; missing CSRF=403, valid CSRF=200",
  );
} finally {
  await app.close();
}
