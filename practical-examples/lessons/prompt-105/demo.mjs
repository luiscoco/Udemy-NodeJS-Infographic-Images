import { assert, fs, spawnNode } from "../../shared/lab.mjs";
await fs.mkdir("./lab/output", { recursive: true });
const flags = [
  "--permission",
  "--allow-fs-read=./lab",
  "--allow-fs-write=./lab/output",
];
let r = await spawnNode([...flags, "lab/main.mjs"]);
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
r = await spawnNode([...flags, "lab/denied.mjs"]);
assert.notEqual(r.code, 0);
assert.ok(r.stderr.includes("ERR_ACCESS_DENIED"));
console.log("outside read denied");

for (const file of ["lab/net-denied.mjs", "lab/process-denied.mjs"]) {
  const result = await spawnNode([...flags, file]);
  assert.notEqual(result.code, 0);
  assert.ok(result.stderr.includes("ERR_ACCESS_DENIED"), result.stderr);
  console.log(file, "denied by permission model");
}
