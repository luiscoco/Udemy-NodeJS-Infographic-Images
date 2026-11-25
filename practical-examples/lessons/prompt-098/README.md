# Prompt 98: Cookie sessions and CSRF

Category: Ecosystem · Purpose: Authenticate browser sessions with appropriate request protection.
Build a cookie-session example using fastify, @fastify/secure-session, and @fastify/csrf-protection. Verify cookie settings, rejected CSRF attempts, expiration, and the revocation limitations of a stateless session design.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 098
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real session and CSRF plugins reject the missing token and accept the matching one. Tokens and keys are not printed.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Cookie authentication and CSRF protection solve separate problems. A browser can attach its session cookie automatically, so a state-changing request also needs proof tied to the expected session flow.

### Follow the implementation

From [demo.mjs, lines 6-29](demo.mjs#L6) (source excerpt; run the full application using the command above):

```javascript
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
```

From [demo.mjs, lines 37-48](demo.mjs#L37) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

The encrypted session cookie has Secure, HttpOnly, and SameSite settings, while the CSRF plugin rejects a missing token. Injection checks application logic; it does not reproduce a browser's cookie-storage behavior.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Keep the same session cookie but omit or alter the CSRF token. Compare the result and explain why authenticating the user alone does not establish intent for a cookie-authenticated action.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

This is in-process HTTP injection for behavior verification. A browser deployment requires HTTPS for the Secure cookie. Expiry and per-user revocation policy need dedicated deployment tests.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-098.png)
- [Original lesson and curated constraints](lesson-brief.txt)
