import { readFile, writeFile } from "node:fs/promises";
const text = await readFile(new URL("./input.txt", import.meta.url), "utf8");
await writeFile(
  new URL("./output/result.txt", import.meta.url),
  text.toUpperCase(),
);
console.log("done");
