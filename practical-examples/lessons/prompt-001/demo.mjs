import { realpath } from "node:fs/promises";
console.log({
  executable: await realpath(process.execPath),
  node: process.version,
  v8: process.versions.v8,
  platform: process.platform,
  arch: process.arch,
});
if (process.versions.node !== "26.13.1")
  throw Error("Select the pinned course runtime: 26.13.1");
