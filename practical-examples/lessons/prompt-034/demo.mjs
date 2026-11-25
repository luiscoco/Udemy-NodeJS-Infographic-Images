import { readFile } from "node:fs/promises";
import settings from "./settings.json" with { type: "json" };
console.log(
  settings.title,
  (await readFile(new URL("./message.txt", import.meta.url), "utf8")).trim(),
);
