import { npm } from "../../shared/npm.mjs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const args = process.argv.includes("--audit")
  ? ["audit", "--json"]
  : ["ls", "--depth=0"];
const r = await npm(args, { cwd: root });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
if (args[0] === "ls" && r.code !== 0) process.exitCode = r.code;
console.log(
  args[0] === "audit"
    ? "Review live advisory reachability; no automatic fixes were applied."
    : "Use --audit to request a live registry advisory report.",
);
