import { Database, backup } from 'node:sqlite';
import { mkdtempDisposable } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

await using temp = await mkdtempDisposable(join(tmpdir(), 'sqlite-lab-'));
using source = new Database(':memory:');
source.exec('CREATE TABLE notes(id INTEGER PRIMARY KEY, body TEXT)');
using insert = source.prepare('INSERT INTO notes VALUES (?, ?)');
insert.run(9007199254740993n, 'safe');

const path = join(temp.path, 'copy.db');
await backup(source, path);
using restored = new Database(path, { readOnly: true });
using rows = restored.prepare('SELECT id, body FROM notes ORDER BY id');
rows.setReadBigInts(true);
for (const row of rows.iterate()) {
  console.log(row.id.toString(), row.body);
}
