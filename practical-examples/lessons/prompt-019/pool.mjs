import { readFile } from "node:fs/promises";
import { scrypt } from "node:crypto";
import { promisify } from "node:util";
const run = promisify(scrypt);
const start = performance.now();
await Promise.all([
  ...Array.from({ length: 8 }, () => run("fixture", "salt", 64)),
  readFile(new URL(import.meta.url)),
]);
console.log("elapsed ms:", Math.round(performance.now() - start));
