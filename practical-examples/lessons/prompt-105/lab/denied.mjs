import { readFile } from "node:fs/promises";
await readFile(new URL("../outside.txt", import.meta.url));
