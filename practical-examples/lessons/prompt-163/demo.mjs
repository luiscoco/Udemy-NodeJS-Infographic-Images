import { Database, constants } from "node:sqlite";

using source = new Database(":memory:");
using target = new Database(":memory:");
for (const db of [source, target]) {
  db.exec("CREATE TABLE notes(id INTEGER PRIMARY KEY, body TEXT)");
}
using session = source.createSession({ table: "notes" });
source.exec("INSERT INTO notes VALUES (1, 'hello')");
const changes = session.changeset();

console.log(target.applyChangeset(changes));
console.log(
  target.applyChangeset(changes, {
    onConflict: () => constants.SQLITE_CHANGESET_ABORT,
  }),
);
using count = target.prepare("SELECT count(*) AS n FROM notes");
console.log(count.get().n);
