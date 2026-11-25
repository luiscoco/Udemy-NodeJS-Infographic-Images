import { enableCompileCache } from "node:module";
console.log(JSON.stringify(enableCompileCache("./.compile-cache")));
await import("./cli.mjs");
