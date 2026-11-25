import { build } from "esbuild";
import { assert, spawnNode } from "../../shared/lab.mjs";
await build({
  entryPoints: ["src/crash.mjs"],
  bundle: true,
  platform: "node",
  format: "esm",
  sourcemap: true,
  outfile: "dist/app.mjs",
});
const ordinary = await spawnNode(["dist/app.mjs"]),
  mapped = await spawnNode(["--enable-source-maps", "dist/app.mjs"]);
console.log("UNMAPPED", ordinary.stderr, "MAPPED", mapped.stderr);
assert.notEqual(ordinary.code, 0);
assert.notEqual(mapped.code, 0);
assert.ok(
  mapped.stderr.includes("src/crash.mjs") ||
    mapped.stderr.includes("src\\crash.mjs"),
);
