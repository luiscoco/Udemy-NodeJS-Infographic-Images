# Prompt 100: Resource authorization

Category: Ecosystem · Purpose: Prevent authenticated users from accessing unauthorized data.
Add owner and administrator authorization to a fastify task API. Create two users and verify one cannot read, update, or delete the other’s tasks by guessing identifiers.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 100
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Real signed identities and PostgreSQL owner predicates prevent cross-user access.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Authentication identifies a caller; authorization decides which resource that caller may access. Owner checks belong in the data-access predicate rather than depending on hard-to-guess IDs.

### Follow the implementation

From [demo.mjs, lines 9-20](demo.mjs#L9) (source excerpt; run the full application using the command above):

```javascript
app.get("/role-tasks/:id", { preHandler: app.authenticate }, async (q, r) => {
  const id = Number(q.params.id);
  if (!Number.isSafeInteger(id) || id < 1)
    return r.code(400).send({ error: "Invalid id" });
  const row = (
    await db.pool.query(
      "SELECT id,title FROM tasks WHERE id=$1 AND (owner_id=$2 OR $3::boolean)",
      [id, q.user.sub, q.user.role === "admin"],
    )
  ).rows[0];
  return row ?? r.code(404).send({ error: "Not found" });
});
```

From [demo.mjs, lines 41-49](demo.mjs#L41) (source excerpt; run the full application using the command above):

```javascript
  assert.equal((await app.inject("/tasks")).statusCode, 401);
  assert.equal(
    (
      await app.inject({
        url: "/role-tasks/" + id,
        headers: { ...b.headers, role: "admin" },
      })
    ).statusCode,
    404,
```

### Why this produces the observed result

The role-aware route uses owner identity and an admin role from the verified JWT. A forged role header grants nothing, and owner-only capstone routes intentionally keep their stricter policy.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Use user B's token to read user A's task and compare 404 with an unauthenticated 401. Explain where the administrator exception is implemented and why an arbitrary header cannot enable it.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **postgres**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-100.png)
- [Original lesson and curated constraints](lesson-brief.txt)

The separate role-aware route contrasts the owner-only capstone routes with an owner-or-admin SQL policy. Only a role from the verified JWT is trusted; a forged role header does not grant access.
