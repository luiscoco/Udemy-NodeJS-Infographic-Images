import { assert, fs, spawnNode } from "../../shared/lab.mjs";
await fs.mkdir("./profiles", { recursive: true });
const r = await spawnNode([
  "--cpu-prof",
  "--cpu-prof-dir=./profiles",
  "work.mjs",
]);
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
const profiles = (await fs.readdir("./profiles")).filter((x) =>
  x.endsWith(".cpuprofile"),
);
console.log("Open in DevTools:", profiles.at(-1));
assert.ok(profiles.length > 0);
