import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using db = await pgLab();
const {
  rows: [task],
} = await db.pool.query(
  "INSERT INTO tasks(title) VALUES('original') RETURNING id",
);
await db.pool.query("ALTER TABLE tasks ADD COLUMN display_title TEXT");
await db.pool.query("UPDATE tasks SET title=$1,display_title=$1 WHERE id=$2", [
  "v2 writes both",
  task.id,
]);
await db.pool.query("UPDATE tasks SET title=$1 WHERE id=$2", [
  "v1 old writer",
  task.id,
]);
let row = (
  await db.pool.query("SELECT title,display_title FROM tasks WHERE id=$1", [
    task.id,
  ])
).rows[0];
assert.notEqual(row.title, row.display_title);
console.log("During overlap read authoritative title:", row.title);
await db.pool.query("UPDATE tasks SET display_title=title");
row = (
  await db.pool.query("SELECT title,display_title FROM tasks WHERE id=$1", [
    task.id,
  ])
).rows[0];
assert.equal(row.title, row.display_title);
console.log("After old writers drained, final catch-up backfill:", row);
