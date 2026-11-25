import { mkdtempDisposable, open, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let path;
{
  await using temp = await mkdtempDisposable(join(tmpdir(), 'node-lab-'));
  path = temp.path;
  await using file = await open(join(path, 'note.txt'), 'w+');
  await file.writeFile('hello');
  console.log(await readFile(join(path, 'note.txt'), 'utf8'));
}
try {
  await access(path);
  console.log('exists');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('removed');
}
