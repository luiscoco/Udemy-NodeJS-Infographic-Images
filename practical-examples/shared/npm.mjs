import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnNode } from "./lab.mjs";
export function npm(args, options = {}) {
  const candidates = [
    process.env.npm_execpath,
    join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
    "/usr/share/nodejs/npm/bin/npm-cli.js",
    "/usr/local/lib/node_modules/npm/bin/npm-cli.js",
  ].filter(Boolean);
  const cli = candidates.find(existsSync);
  if (!cli) throw Error("Run with npm run lesson -- NUMBER.");
  return spawnNode([cli, ...args], {
    ...options,
    env: {
      ...process.env,
      NPM_CONFIG_CACHE: fileURLToPath(
        new URL("../.npm-cache/", import.meta.url),
      ),
      ...options.env,
    },
  });
}
