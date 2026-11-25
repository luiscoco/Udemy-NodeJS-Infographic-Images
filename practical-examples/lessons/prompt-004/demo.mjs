import { assert, spawnNode } from "../../shared/lab.mjs";
for (const PORT of ["3000", "0", "not-a-port"]) {
  const r = await spawnNode(["--env-file=fixture.env", "config.mjs"], {
    env: {
      ...process.env,
      PORT,
      DEBUG: "false",
      API_KEY: "public-lab-fixture",
    },
  });
  console.log({ PORT, ...r });
  assert.equal(r.code, PORT === "3000" ? 0 : 1);
}
