# Prompt 158: Fetch Connection Management

Configure native fetch with an Undici-compatible dispatcher. Bound per-origin connections, consume response bodies, apply deadlines, and close owned client resources after a workload. Verify behavior against a local HTTP fixture.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 158
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

An actual local fixture supplies two responses to native fetch through a bounded Undici dispatcher; owned connections are closed.

## Walkthrough and experiments

Prerequisite: a separate local fixture server is already listening on 127.0.0.1:3000 and exposes GET /health; its body determines the output. Undici is an ecosystem package; fetch is a Node global. Choose a version compatible with Node 26.13.1 and commit the lockfile; do not invent package versions. connections:2 is a per-origin connection cap, not a global request-rate limit. pipelining:1 avoids multiple outstanding pipelined requests per connection. fetch does not use node:http.Agent. Consume or cancel every body. The two sequential calls demonstrate ownership, not measured concurrency; complete the exercise with concurrent requests and instrument active sockets. Verify the cap, deadline, HTTP-error cleanup and natural exit. Do not claim reuse is guaranteed or that tests ran.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-158.png)
- [Original lesson and curated constraints](lesson-brief.txt)
