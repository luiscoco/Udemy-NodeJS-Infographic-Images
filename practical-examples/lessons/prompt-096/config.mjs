import { readFile } from "node:fs/promises";
try {
  const value =
    process.env.APP_SECRET ??
    (process.env.APP_SECRET_FILE
      ? await readFile(process.env.APP_SECRET_FILE, "utf8")
      : "");
  if (!value.trim()) throw Error("Missing secret");
  console.log({ secretConfigured: true });
} catch {
  console.error("Configuration unavailable");
  process.exitCode = 1;
}
