import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bootstrap = fs.readFileSync(path.join(root, 'app/bootstrap.js'), 'utf8');

test('production entry points to V1.7 bootstrap', () => {
  assert.match(index, /app\/bootstrap\.js/);
  assert.doesNotMatch(index, /engine\/app\.js/);
  assert.doesNotMatch(bootstrap, /engine\/app\.js/);
});
