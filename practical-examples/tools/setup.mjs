import { randomBytes } from "node:crypto";
import { writeFile, readFile } from "node:fs/promises";
const target = new URL("../.env", import.meta.url),
  password = randomBytes(24).toString("hex"),
  key = randomBytes(32).toString("hex");
try {
  await writeFile(
    target,
    `JWT_KEY=${key}\nDB_PASSWORD=${password}\nDATABASE_URL=postgres://course:${password}@127.0.0.1:55432/course_lab\nREDIS_URL=redis://127.0.0.1:56379\nMONGODB_URL=mongodb://127.0.0.1:57017\n`,
    { flag: "wx", mode: 0o600 },
  );
  console.log("Created local .env; credentials were not printed.");
} catch (e) {
  if (e.code !== "EEXIST") throw e;
  let text = await readFile(target, "utf8");
  if (!text.match(/^JWT_KEY=(.+)$/m)) {
    text = text.replace(/^JWT_KEY=.*\r?\n?/m, "");
    await writeFile(target, text + "JWT_KEY=" + key + "\n", { mode: 0o600 });
    console.log("Added missing local JWT key; other configuration preserved.");
  } else console.log("Existing local configuration preserved.");
}
