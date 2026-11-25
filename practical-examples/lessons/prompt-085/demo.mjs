import { Database } from "node:sqlite";
import { assert, fs, temp, join } from "../../shared/lab.mjs";
await using lab = await temp();
const file = join(lab.path, "notes.db");
for (let pass = 1; pass <= 2; pass++) {
  const db = new Database(file);
  try {
    db.exec(
      "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY,text TEXT NOT NULL)",
    );
    using insert = db.prepare("INSERT INTO notes(text) VALUES (?)");
    insert.run("Learn Node.js");
    using read = db.prepare("SELECT * FROM notes ORDER BY id");
    const rows = read.all();
    console.log(rows);
    assert.equal(rows.length, pass);
  } finally {
    db.close();
  }
}
