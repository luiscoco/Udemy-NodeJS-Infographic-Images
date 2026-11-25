import { pgLab } from "../../shared/postgres.mjs";
import assert from "node:assert/strict";
await using lab = await pgLab();
const {
  rows: [task],
} = await lab.pool.query(
  "INSERT INTO tasks(title) VALUES('original') RETURNING *",
);
const results = await Promise.all(
  ["edit A", "edit B"].map((title) =>
    lab.pool.query(
      "UPDATE tasks SET title=$1,version=version+1 WHERE id=$2 AND version=$3 RETURNING *",
      [title, task.id, task.version],
    ),
  ),
);
console.log(
  results.map((x) => ({ status: x.rowCount ? 200 : 409, rows: x.rows })),
);
assert.deepEqual(results.map((x) => x.rowCount).sort(), [0, 1]);
