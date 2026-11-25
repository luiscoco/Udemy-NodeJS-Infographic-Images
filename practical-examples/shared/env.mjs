import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const envFile = fileURLToPath(new URL("../.env", import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
export function localURL(value, fallback) {
  const url = new URL(value ?? fallback);
  if (
    ![
      "127.0.0.1",
      "localhost",
      ...(process.env.COURSE_CONTAINER_LAB === "1"
        ? ["db", "redis", "mongo"]
        : []),
    ].includes(url.hostname) &&
    process.env.COURSE_ALLOW_REMOTE_LAB !== "1"
  )
    throw Error(
      "Use a local disposable course service, not a production database.",
    );
  return url;
}
