import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import "./env.mjs";
export async function deploymentDemo(mode) {
  const env = fileURLToPath(new URL("../.env", import.meta.url)),
    compose = fileURLToPath(
      new URL("../deployment/compose.yaml", import.meta.url),
    );
  const docker = (args) =>
    execFileSync(
      "docker",
      ["compose", "--env-file", env, "-f", compose, ...args],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
    );
  const base = "http://127.0.0.1:58080";
  async function ready() {
    for (let i = 0; i < 120; i++) {
      try {
        const r = await fetch(base + "/ready");
        await r.body?.cancel();
        if (r.ok) return;
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    throw Error("Deployment readiness deadline");
  }
  let started = false;
  try {
    started = true;
    docker(["up", "-d", "--build"]);
    await ready();
    const credentials = {
      email: randomUUID() + "@course.invalid",
      password: "public-fixture-password",
    };
    let response = await fetch(base + "/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });
    assert.equal(response.status, 201);
    await response.body?.cancel();
    response = await fetch(base + "/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });
    assert.equal(response.status, 200);
    const headers = {
      authorization: "Bearer " + (await response.json()).token,
      "content-type": "application/json",
    };
    response = await fetch(base + "/tasks", {
      method: "POST",
      headers,
      body: JSON.stringify({ title: "persistent Compose task" }),
    });
    assert.equal(response.status, 201);
    const task = await response.json();
    docker(["up", "-d", "--force-recreate", "--no-deps", "api1"]);
    await ready();
    response = await fetch(base + "/tasks/" + task.id, { headers });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).title, "persistent Compose task");
    console.log("task survived API container replacement");
    const instances = new Set();
    for (let i = 0; i < 20; i++) {
      const r = await fetch(base + "/instance");
      if (r.ok) instances.add((await r.json()).instance);
      else await r.body?.cancel();
    }
    console.log("Observed replica identities:", [...instances]);
    if (mode === "full") {
      response = await fetch(base + "/reports", {
        method: "POST",
        headers,
        body: "{}",
      });
      const report = await response.json();
      assert.equal(response.status, 202, JSON.stringify(report));
      let completed = false;
      for (let i = 0; i < 100; i++) {
        const r = await fetch(base + "/reports/" + report.id, { headers }),
          body = await r.json();
        if (body.status === "complete") {
          completed = true;
          assert.equal(body.result.total, 42);
          break;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
      assert.ok(completed, "worker must publish result");
      const metrics = await (await fetch(base + "/metrics")).text();
      assert.ok(metrics.includes("course_http_requests_total"));
      console.log(
        "BullMQ report completed; Prometheus metrics exposed; trace IDs are in API JSON logs.",
      );
    }
  } finally {
    if (started) docker(["down", "--remove-orphans"]);
  }
}
