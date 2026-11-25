import test from 'node:test';
test('file B owns its process global', (t) => {
  globalThis.owner ??= 'B';
  t.assert.equal(globalThis.owner, 'B');
});
