import test from 'node:test';
test('file A owns its process global', (t) => {
  globalThis.owner ??= 'A';
  t.assert.equal(globalThis.owner, 'A');
});
