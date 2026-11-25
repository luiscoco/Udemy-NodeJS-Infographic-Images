import { runner } from "node-pg-migrate";
import { fileURLToPath } from "node:url";
import { localURL } from "../../shared/env.mjs";
if (!process.env.DATABASE_URL) throw Error("Run tools/setup.mjs first");
const url = localURL(process.env.DATABASE_URL);
await runner({
  databaseUrl: url.href,
  schema: "course_app",
  migrationsSchema: "course_app",
  migrationsTable: "migration_versions",
  createSchema: true,
  createMigrationsSchema: true,
  dir: fileURLToPath(new URL("./migrations/", import.meta.url)),
  direction: "up",
  log: (message) => console.log(message),
});
console.log("Versioned course schema ready.");
