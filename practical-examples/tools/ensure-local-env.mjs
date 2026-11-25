import { readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
const url = new URL("../.env", import.meta.url);
let text = await readFile(url, "utf8");
const key = text.match(/^JWT_KEY=(.*)$/m)?.[1];
if (!key) {
  text = text.replace(/^JWT_KEY=.*\r?\n?/m, "");
  text += "JWT_KEY=" + randomBytes(32).toString("hex") + "\n";
  await writeFile(url, text, { mode: 0o600 });
  console.log("Added missing local JWT key; value not printed.");
}
