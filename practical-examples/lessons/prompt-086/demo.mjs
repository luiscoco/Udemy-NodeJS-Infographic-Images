import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using lab = await pgLab();
const title = "x'; DROP TABLE tasks; --";
await lab.pool.query("INSERT INTO tasks(title) VALUES($1)", [title]);
const rows = (
  await lab.pool.query("SELECT id,title FROM tasks WHERE title=$1", [title])
).rows;
console.log(rows);
assert.equal(rows[0].title, title);
assert.equal(
  (await lab.pool.query("SELECT count(*) FROM tasks")).rows[0].count,
  "1",
);
