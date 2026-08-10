import test from 'node:test';
import assert from 'node:assert/strict';

test('V1.7 bootstrap is importable in the test runtime', async () => {
  const bootstrap = await import('../app/bootstrap.js');
  assert.equal(typeof bootstrap.bootstrap, 'function');
  assert.ok(bootstrap.state);
});
