import { readFile } from "node:fs/promises";
import { appName } from "@app/config";
console.log(appName, typeof readFile);
await import("@app/missing").catch((e) => console.error(e.message));
