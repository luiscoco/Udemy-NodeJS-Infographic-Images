import test from 'node:test';

test('stable result contract', (t) => {
  const result = { status: 'ok', items: ['a', 'b'] };
  t.assert.equal(result.items.length, 2);
  t.assert.snapshot(result);
});
