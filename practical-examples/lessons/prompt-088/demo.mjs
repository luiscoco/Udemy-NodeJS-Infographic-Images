import { runner } from "node-pg-migrate";
import { fileURLToPath } from "node:url";
import { pgLab, transaction } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using lab = await pgLab();
await lab.pool.query(
  "CREATE TABLE migration_versions(version INTEGER PRIMARY KEY)",
);
await transaction(lab.pool, async (client) => {
  await client.query(
    "ALTER TABLE tasks ADD COLUMN priority INTEGER NOT NULL DEFAULT 0",
  );
  await client.query("INSERT INTO migration_versions VALUES(1)");
});
await lab.pool.query("INSERT INTO tasks(title) VALUES('persisted fixture')");
assert.equal(
  (await lab.pool.query("SELECT priority FROM tasks")).rows[0].priority,
  0,
);
console.log("additive migration applied; existing/default data verified");

await runner({
  databaseUrl: process.env.DATABASE_URL,
  schema: lab.schema,
  migrationsSchema: lab.schema,
  migrationsTable: "cli_versions",
  dir: fileURLToPath(new URL("./migrations/*.cjs", import.meta.url))
    .split(String.fromCharCode(92))
    .join("/"),
  useGlob: true,
  direction: "up",
  log: () => {},
});
assert.ok(
  (
    await lab.pool.query("SELECT to_regclass($1) AS name", [
      lab.schema + ".migration_notes",
    ])
  ).rows[0].name,
);
console.log(
  "node-pg-migrate CLI engine discovered and applied the supplied migration through glob 14",
);
