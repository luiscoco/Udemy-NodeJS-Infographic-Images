import assert from "node:assert/strict";
const plugins = new Map([["hello", () => import("./plugins/hello.mjs")]]);
async function load(name) {
  const factory = plugins.get(name);
  if (!factory) throw Error("Unknown plugin");
  return (await factory()).run();
}
console.log(await load("hello"));
await assert.rejects(load("../../secret"), /Unknown/);
console.log("unknown path rejected before import");
