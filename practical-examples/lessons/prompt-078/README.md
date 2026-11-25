# Prompt 78: Request and response validation

Category: Ecosystem · Purpose: Enforce an API contract at its boundaries.
Add trusted JSON Schemas to a fastify endpoint for parameters, body, and response. Verify invalid requests fail and internal fields do not appear in serialized responses.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 078
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Invalid input yields 400, while the response schema strips an internal field from the successful 201 response.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Request schemas validate route parameters and body fields before business handling. Response schemas define which fields may leave the API.

### Follow the implementation

From [demo.mjs, lines 5-32](demo.mjs#L5) (source excerpt; run the full application using the command above):

```javascript
app.post(
  "/tasks/:id",
  {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "integer" } },
      },
      body: {
        type: "object",
        required: ["title"],
        properties: { title: { type: "string", minLength: 1 } },
      },
      response: {
        201: {
          type: "object",
          additionalProperties: false,
          properties: { id: { type: "integer" }, title: { type: "string" } },
        },
      },
    },
  },
  async (q, r) =>
    r
      .code(201)
      .send({ id: q.params.id, title: q.body.title, internal: "hidden" }),
);
```

From [demo.mjs, lines 34-42](demo.mjs#L34) (source excerpt; run the full application using the command above):

```javascript
  for (const [url, payload, status] of [
    ["/tasks/1", { title: "hello" }, 201],
    ["/tasks/x", { title: "hello" }, 400],
    ["/tasks/1", {}, 400],
  ]) {
    const r = await app.inject({ method: "POST", url, payload });
    console.log(r.statusCode, r.body);
    assert.equal(r.statusCode, status);
    if (status === 201) assert.ok(!("internal" in r.json()));
```

### Why this produces the observed result

The successful handler contains an internal field, but serialization removes it from the public response. Invalid IDs and missing titles receive 400, independently of output-field filtering.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Add an internal property to the handler result without adding it to the response schema. Confirm it stays absent, then test an empty title against minLength.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-078.png)
- [Original lesson and curated constraints](lesson-brief.txt)
